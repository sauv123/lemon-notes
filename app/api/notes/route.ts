import { NextResponse } from 'next/server';
import { processNotes } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { notes } = body;

    if (!notes) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }

    const { summary, concepts, tags, formulas, laws_and_principles, important_points } = await processNotes(notes);

    return NextResponse.json({ summary, concepts, tags, formulas, laws_and_principles, important_points });
  } catch (error) {
    console.error('API /notes Error:', error);
    return NextResponse.json(
      { error: 'Failed to process notes' },
      { status: 500 }
    );
  }
}
