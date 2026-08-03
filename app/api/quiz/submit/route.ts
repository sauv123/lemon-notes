import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { results } = body; 
    // results: { questionId: string, isCorrect: boolean, topic: string }[]

    if (!results || !Array.isArray(results)) {
      return NextResponse.json({ error: 'Results required' }, { status: 400 });
    }

    const total = results.length;
    const correct = results.filter((r) => r.isCorrect).length;
    const score = Math.round((correct / total) * 100);

    const weakTopics = results
      .filter((r) => !r.isCorrect && r.topic)
      .map((r) => r.topic);

    // Filter unique weak topics
    const uniqueWeakTopics = [...new Set(weakTopics)];

    // In a real database, we would save these weak topics to Supabase here

    return NextResponse.json({ 
      score, 
      weakTopics: uniqueWeakTopics,
      correct,
      total
    });
  } catch (error) {
    console.error('API /quiz/submit Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
