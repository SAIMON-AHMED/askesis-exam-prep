import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body.message || '';
    const context = body.context || '';

    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are Askesis AI, an expert adaptive exam tutor. Context: ${context}. Student question: ${message}`,
                },
              ],
            },
          ],
        });
        const reply = response.text || 'I am here to help you master every concept on your exam!';
        return NextResponse.json({ reply });
      } catch (geminiErr) {
        console.warn('Gemini API call fallback:', geminiErr);
      }
    }

    let reply = `Great question! When approaching questions related to this topic, keep three core strategies in mind:

1. **Deconstruct the Prompt**: Identify the specific target variable or primary claim before inspecting the answer choices.
2. **Eliminate Common Traps**: Look for choices that are technically true in isolation but fail to answer the exact question being asked.
3. **Verify with Back-Substitution or Textual Proof**: Re-plug your answer into the equation or cite the specific line in the passage.`;

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
