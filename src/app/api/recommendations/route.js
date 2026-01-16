import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { reading } = body;

    // 1. Basic Validation
    if (!reading) {
      return NextResponse.json({ error: "No sensor readings provided" }, { status: 400 });
    }

    // 2. Use the NEW model name (Gemini 2.5 Flash)
    // "gemini-1.5-flash" is deprecated/retired as of late 2025.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Act as a Senior Water Quality Engineer. Analyze these sensor readings:
      - Dissolved Oxygen (DO): ${reading.do} mg/L
      - Electrical Conductivity (EC): ${reading.ec} μS/cm
      - Total Dissolved Solids (TDS): ${reading.tds} ppm
      - Turbidity: ${reading.turbidity} NTU

      Return a JSON array of 4 strings containing high-priority actions.
      - If TDS > 1000 or Turbidity > 5, emphasize health risks. 
      - If DO < 4, emphasize risks to aquatic life.
      - Use professional, concise language.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const recommendations = JSON.parse(responseText);

    return NextResponse.json(recommendations);

  } catch (error) {
    console.error("AI Route Error:", error);
    // Return fallback data so your UI doesn't crash
    return NextResponse.json([
      "Alert: Unable to access AI analysis.",
      "Action: Manually verify sensor calibration.",
      "Note: Defaulting to standard safety protocols.",
      "Check: Internet connection or API quota."
    ], { status: 200 }); 
  }
}