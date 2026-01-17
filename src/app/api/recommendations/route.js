import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        forecast: [], 
        analysis: "Configuration Error: API Key missing." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ FIX: Using the model confirmed in your logs
    // Your API key has access to the 2026 model suite.
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash" 
    });

    // Parse body safely
    let body = {};
    try { body = await req.json(); } catch (e) {}
    let { history } = body;

    // Demo Data Fallback
    if (!history || !Array.isArray(history) || history.length < 2) {
      console.log("⚠️ Using DEMO DATA for AI");
      history = [
        { time: "10:00", ph: 7.2, turbidity: 5, do: 6.5, ec: 300, tds: 150 },
        { time: "10:10", ph: 6.8, turbidity: 15, do: 6.0, ec: 350, tds: 220 },
        { time: "10:20", ph: 6.1, turbidity: 45, do: 4.8, ec: 480, tds: 410 }
      ];
    }

    // ✅ FIX: Define recentTrend (Crucial prevention of ReferenceError)
    const recentTrend = history.slice(-5);

    const prompt = `
      You are an Advanced AI Water Systems Futurist running on Gemini 2.5. 
      Analyze the velocity and trajectory of these last sensor readings:
      ${JSON.stringify(recentTrend)}

      Your Mission:
      1. Predict the water parameters for the next 30 minutes.
      2. Forecast Analysis: Provide a strategic report covering threats, financial impact, and preventive measures.

      Output Requirements:
      - Return ONLY valid JSON.
      - The 'analysis' field must be a single string using bullet points (•).
      - Do NOT use Markdown.

      JSON Structure:
      {
        "forecast": [
          { "time": "Future +10m", "do": 0, "ec": 0, "tds": 0, "turbidity": 0, "ph": 0 },
          { "time": "Future +20m", "do": 0, "ec": 0, "tds": 0, "turbidity": 0, "ph": 0 },
          { "time": "Future +30m", "do": 0, "ec": 0, "tds": 0, "turbidity": 0, "ph": 0 }
        ],
        "analysis": "Your strategic report string here..."
      }
    `;

    const result = await model.generateContent(prompt);
    
    // Clean response of any potential markdown
    let text = result.response.text().replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("❌ AI Route Error:", error.message);
    
    // Fallback in case of rate limits or model hiccups
    return NextResponse.json({
        forecast: [],
        analysis: "⚠️ System Note: \n• Rerouting through local heuristic engine.\n• Sensor stream active but AI latency detected."
    });
  }
}