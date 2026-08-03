import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No audio file uploaded' }, { status: 400 });
    }
    
    // Construct new FormData for Groq's API
    const groqData = new FormData();
    groqData.append('file', file);
    groqData.append('model', 'whisper-large-v3');
    
    const groqReq = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY}`
      },
      body: groqData
    });
    
    if (!groqReq.ok) {
      const e = await groqReq.text();
      console.error("Groq Transcribe error:", e);
      throw new Error(`Groq Whisper API Failed: ${e}`);
    }
    
    const data = await groqReq.json();
    
    if (!data.text || data.text.trim().length === 0) {
      return NextResponse.json({ error: 'No speech could be detected in the audio file.' }, { status: 400 });
    }

    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error('API /transcribe Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the uploaded audio file' },
      { status: 500 }
    );
  }
}
