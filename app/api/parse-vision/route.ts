import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is missing from .env.local. Vision AI requires OpenAI.' },
        { status: 401 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    let fullText = "";

    // Process each image sequentially to avoid rate limits
    for (const imageUrl of images) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "You are an expert data extraction AI. Transcribe this document page into Markdown. Preserve all headings, bullet points, and text. For mathematical formulas, strictly use LaTeX syntax wrapped in $$...$$ for block math and \\(...\\) for inline math. If there is a highly important chart or image, insert an image placeholder like `![Description of Image](data:image/png;base64,...)` using the actual base64 of the image if possible, or just describe it well. Do not hallucinate content not present in the image." 
              },
              { 
                type: "image_url", 
                image_url: { url: imageUrl } 
              }
            ]
          }
        ],
        max_tokens: 2000,
      });

      const text = response.choices[0]?.message?.content || "";
      fullText += text + "\n\n---\n\n";
    }

    return NextResponse.json({ text: fullText });
  } catch (error) {
    console.error('API /parse-vision Error:', error);
    return NextResponse.json(
      { error: 'Failed to parse images with Vision AI' },
      { status: 500 }
    );
  }
}
