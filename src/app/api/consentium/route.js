import { NextResponse } from "next/server";

// Helper function to dynamically map values based on the board's configuration
function formatFeed(feed, boardInfo) {
  const reading = {
    time: new Date(feed.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    // Set default values
    do: "—",
    ec: "—",
    turbidity: "—",
    tds: "—",
  };

  // Create a mapping from the parameter name (e.g., "do") to its value key (e.g., "value1")
  // This makes the mapping case-insensitive by using toLowerCase()
  const infoMap = {
    [boardInfo.info1?.toLowerCase()]: 'value1',
    [boardInfo.info2?.toLowerCase()]: 'value2',
    [boardInfo.info3?.toLowerCase()]: 'value3',
    [boardInfo.info4?.toLowerCase()]: 'value4',
  };

  // Dynamically assign the values based on the map we just created
  if (infoMap['do'] && feed[infoMap['do']] != null) reading.do = feed[infoMap['do']];
  if (infoMap['ec'] && feed[infoMap['ec']] != null) reading.ec = feed[infoMap['ec']];
  if (infoMap['conductivity'] && feed[infoMap['conductivity']] != null) reading.ec = feed[infoMap['conductivity']]; // Handle alternate name
  if (infoMap['turbidity'] && feed[infoMap['turbidity']] != null) reading.turbidity = feed[infoMap['turbidity']];
  if (infoMap['tds'] && feed[infoMap['tds']] != null) reading.tds = feed[infoMap['tds']];
  
  return reading;
}

export async function GET(request) {
  try {
    if (!process.env.CONSENTIUM_BASE_URL || !process.env.CONSENTIUM_RECEIVE_KEY || !process.env.CONSENTIUM_BOARD_KEY) {
      console.warn("Consentium env variables not set");
      return NextResponse.json([]);
    }
    
    const { searchParams } = new URL(request.url);
    const isLive = searchParams.get('live') === 'true';

    const url = isLive
      ? `${process.env.CONSENTIUM_BASE_URL}/getData?recents=true&receiveKey=${process.env.CONSENTIUM_RECEIVE_KEY}&boardKey=${process.env.CONSENTIUM_BOARD_KEY}`
      : `${process.env.CONSENTIUM_BASE_URL}/getData?receiveKey=${process.env.CONSENTIUM_RECEIVE_KEY}&boardKey=${process.env.CONSENTIUM_BOARD_KEY}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
        console.warn(`Consentium not reachable (status: ${res.status})`);
        return NextResponse.json(isLive ? {} : []);
    }

    const responseData = await res.json();
    if (!responseData || !responseData.feeds || responseData.feeds.length === 0) {
        console.warn("Consentium returned no feed data");
        return NextResponse.json(isLive ? {} : []);
    }
    
    // Get the board configuration to understand the data
    const boardInfo = responseData.board;

    // Handle the "live" request
    if (isLive) {
        const latestFeed = responseData.feeds[0];
        const formattedFeed = formatFeed(latestFeed, boardInfo);
        return NextResponse.json(formattedFeed);
    }

    // Handle the history request
    const formattedData = responseData.feeds
      .map(feed => formatFeed(feed, boardInfo))
      .reverse();

    return NextResponse.json(formattedData);

  } catch (err) {
    const isLiveRequest = new URL(request.url).searchParams.get('live') === 'true';
    console.warn("Consentium fetch failed", err);
    return NextResponse.json(isLiveRequest ? {} : []);
  }
}