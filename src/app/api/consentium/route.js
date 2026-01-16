import { NextResponse } from "next/server";

// Helper function to dynamically map values based on the board's configuration
function formatFeed(feed, boardInfo) {
  const reading = {
    time: new Date(feed.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    // ✨ FIX 4: Initialize with null instead of "—" for better data handling
    do: null,
    ec: null,
    turbidity: null,
    tds: null,
  };

  const parameters = [
    { name: boardInfo.info1, valueKey: 'value1' },
    { name: boardInfo.info2, valueKey: 'value2' },
    { name: boardInfo.info3, valueKey: 'value3' },
    { name: boardInfo.info4, valueKey: 'value4' },
  ];

  // ✨ FIX: Iterate over the parameters to robustly map names to values
  parameters.forEach(param => {
    // Ensure the parameter is actually configured and has a value in the feed
    if (!param.name || feed[param.valueKey] == null) {
      return; // Skip this one
    }

    const paramName = param.name.toLowerCase();
    const value = feed[param.valueKey];

    // Check for known parameter names/aliases and assign to our standard keys
    if (paramName.includes('do') || paramName.includes('oxygen')) {
      reading.do = value;
    } else if (paramName.includes('ec') || paramName.includes('conductivity')) {
      reading.ec = value;
    } else if (paramName.includes('turbidity')) {
      reading.turbidity = value;
    } else if (paramName.includes('tds')) {
      reading.tds = value;
    }
  });

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