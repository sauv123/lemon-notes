import { NextResponse } from "next/server";
import { chatWithNotes } from "@/lib/aiService";

export async function POST(req: Request) {
  try {
    const { notes, history } = await req.json();

    if (!notes || !history) {
      return NextResponse.json(
        { error: "Notes and chat history are required." },
        { status: 400 }
      );
    }

    const { message } = await chatWithNotes(notes, history);
    return NextResponse.json({ message });
  } catch (error) {
    console.error("API /chat Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat response" },
      { status: 500 }
    );
  }
}
