import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing in .env" }, { status: 500 });
    }

    // 1. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Select the model (gemini-1.5-flash is fast and free)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
        // Ekhane system instruction set kora jay
        systemInstruction: "You are an Expert Full Stack Web Developer. You are expert in MERN stack, Next.js, TypeScript, PostgreSQL, and Socket.io. Provide technical guidance, code reviews, and structured learning plans like a senior mentor.",
    });

    const { message } = await req.json();

    // 3. Generate Content
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error.message);
    return NextResponse.json({ error: "AI failed to respond: " + error.message }, { status: 500 });
  }
}