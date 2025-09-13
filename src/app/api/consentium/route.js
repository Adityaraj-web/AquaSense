import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    if (
      !process.env.CONSENTIUM_BASE_URL ||
      !process.env.CONSENTIUM_RECEIVE_KEY ||
      !process.env.CONSENTIUM_BOARD_KEY
    ) {
      console.warn("Consentium env variables not set");
      return NextResponse.json([]); 
    }
    
    // Check if the request is asking for only the latest data (e.g., /api/consentium?live=true)
    const { searchParams } = new URL(request.url);
    const isLive = searchParams.get('live') === 'true';

    // Use the "recents=true" parameter when fetching only the latest data point
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
    
    // If "live" is requested, format and return only the latest object
    if (isLive) {
        const latestFeed = responseData.feeds[0];
        return NextResponse.json({
            time: new Date(latestFeed.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            ec: latestFeed.value1,
            turbidity: latestFeed.value2,
        });
    }

    // If history is requested, format and return the entire array
    const formattedData = responseData.feeds.map(feed => ({
        time: new Date(feed.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        ec: feed.value1,
        turbidity: feed.value2,
    })).reverse(); // Reverse to have time flowing from left to right

    return NextResponse.json(formattedData);

  } catch (err) {
    // Ensure we return the correct empty type based on the request
    const isLiveRequest = new URL(request.url).searchParams.get('live') === 'true';
    console.warn("Consentium fetch failed", err);
    return NextResponse.json(isLiveRequest ? {} : []);
  }
}