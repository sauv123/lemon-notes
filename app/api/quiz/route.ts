import { NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { notes } = body;

    if (!notes || typeof notes !== 'string') {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }

    const questions = await generateQuiz(notes);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('API /quiz Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
