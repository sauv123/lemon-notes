import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function processNotes(notes: string) {
  try {
    const safeNotes = notes.slice(0, 15000);

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a highly advanced AI Study Assistant and Document Analyzer. 
Take the user's notes and extract:
1. A concise summary of the material.
2. Key concepts (list).
3. 3 semantic tags.
4. Any mathematical, physics, or scientific formulas/equations present in the text. Transcribe them precisely into LaTeX format (e.g. \\( E = mc^2 \\)).
5. Any laws or principles mentioned (e.g. Design Laws, Physics Laws).
6. Important points, highlighting key facts.

Respond ONLY in valid JSON format with the following structure: 
{ 
  "summary": "(A concise summary)", 
  "concepts": ["concept 1", "concept 2"], 
  "tags": ["Tag1", "Tag2"],
  "formulas": [{"name": "Formula Name", "equation": "\\\\( E = mc^2 \\\\)"}],
  "laws_and_principles": [{"name": "Law Name", "description": "Law description"}],
  "important_points": ["Point 1", "Point 2"]
}`
        },
        {
          role: "user",
          content: safeNotes
        }
      ],
      response_format: { type: "json_object" },
    });

    const resultText = response.choices[0].message.content || "{}";
    const result = JSON.parse(resultText);
    
    return {
      summary: result.summary || "No summary generated.",
      concepts: result.concepts || [],
      tags: result.tags || [],
      formulas: result.formulas || [],
      laws_and_principles: result.laws_and_principles || [],
      important_points: result.important_points || []
    };
  } catch (error) {
    console.error("Error processing notes with AI:", error);
    throw new Error("Failed to process notes");
  }
}

export async function generateQuiz(notes: string) {
  try {
    const safeNotes = notes.slice(0, 15000);
    const numWords = safeNotes.split(/\s+/).length;
    let questionCount = 3;
    if (numWords > 500) questionCount = 5;
    if (numWords > 1500) questionCount = 10;
    if (numWords > 3000) questionCount = 15;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an AI Study Assistant designed to be quirky, unpredictable, and highly effective. Generate exactly ${questionCount} questions based on the provided notes. Mix these four formats randomly: Multiple Choice (MCQ), Short Answer, True/False, and Fill-in-the-blank. Ensure mathematical formulas use LaTeX syntax like $$...$$ or \\(...\\). Respond ONLY in valid JSON format with the following structure: { "questions": [ { "id": "1", "type": "mcq", "text": "Question text?", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "topic": "Topic name" }, { "id": "2", "type": "short_answer", "text": "Question text?", "correctAnswer": "The exact short answer.", "topic": "Topic name" }, { "id": "3", "type": "true_false", "text": "Statement is true or false?", "options": ["True", "False"], "correctAnswer": "True", "topic": "Topic name" }, { "id": "4", "type": "fill_in_the_blank", "text": "The powerhouse of the cell is the _____.", "correctAnswer": "mitochondria", "topic": "Topic name" } ] }`
        },
        {
          role: "user",
          content: safeNotes
        }
      ],
      response_format: { type: "json_object" },
    });

    const resultText = response.choices[0].message.content || "{}";
    const result = JSON.parse(resultText);
    
    return result.questions || [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
}

export async function chatWithNotes(notes: string, messageHistory: {role: string, content: string}[]) {
  try {
    const safeNotes = notes.slice(0, 15000);
    const systemPrompt = `You are a helpful Open-Book Study Assistant. 
    You must answer the user's questions relying strictly on the following study notes provided below.
    If the answer cannot be found in the notes, state clearly that you cannot answer it based on the current material.
    
    STUDY NOTES:
    ---
    ${safeNotes}
    ---`;

    // Ensure we only pass 'user' or 'assistant' roles to the API, map standard roles nicely
    const safeHistory = messageHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    })) as any[];

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...safeHistory
      ],
    });

    return {
      message: response.choices[0].message.content || "I couldn't generate a response."
    };
  } catch (error) {
    console.error("Error in open book chat:", error);
    throw new Error("Failed to generate chat response");
  }
}

