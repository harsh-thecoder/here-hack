import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination, days, budget, people, type } = body;

    if (!destination || !days || !budget || !people || !type) {
      return NextResponse.json(
        { error: "Missing required trip parameters." },
        { status: 400 }
      );
    }

    const prompt = `
      You are a travel assistant. Generate a detailed travel plan for the following trip:
      Destination: ${destination.title || destination.address.label}
      Days: ${days}
      Budget Range: $${budget[0]} - $${budget[1]}
      Number of People: ${people}
      Trip Type: ${type}

      Provide a day-wise itinerary including activities, places to visit, food recommendations, and tips.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ plan: text });
  } catch (error) {
    console.error("Gemini API Error:", error);

    const isQuotaError =
      error.message?.includes("429 Too Many Requests") ||
      error.toString().includes("429");

    if (isQuotaError) {
      return NextResponse.json(
        {
          error:
            "You have exceeded your Gemini API quota limits. Please wait before retrying or check your billing and quota details at https://ai.google.dev/gemini-api/docs/rate-limits.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
