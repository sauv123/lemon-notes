import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { question, correctAnswer, userAnswer } = await req.json();

    if (!question || !correctAnswer || !userAnswer) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an AI teacher evaluating a student's answer to a short answer question.
Determine if the student's answer is correct based on the provided correct answer. 
Allow for synonyms, different phrasings, and minor typos, as long as the core concept is correct.

Return your evaluation strictly in JSON format:
{
  "isCorrect": boolean,
  "explanation": "A short 1-sentence explanation of why it is correct or incorrect compared to the true answer."
}`
        },
        {
          role: "user",
          content: `Question: ${question}\nCorrect Answer: ${correctAnswer}\nStudent's Answer: ${userAnswer}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const resultText = response.choices[0].message.content || "{}";
    const result = JSON.parse(resultText);

    return NextResponse.json({ 
      isCorrect: !!result.isCorrect,
      explanation: result.explanation || "" 
    });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 });
  }
}
