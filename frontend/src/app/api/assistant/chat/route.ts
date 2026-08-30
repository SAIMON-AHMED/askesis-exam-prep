import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body.message || '';
    const context = body.context || '';

    // If Gemini API Key is available in environment, we can optionally use it
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

    // Fallback intelligent exam tutor responses
    let reply = `Great question! When approaching questions related to this topic, keep three core strategies in mind:

1. **Deconstruct the Prompt**: Identify the specific target variable or primary claim before inspecting the answer choices.
2. **Eliminate Common Traps**: Look for choices that are technically true in isolation but fail to answer the exact question being asked.
3. **Verify with Back-Substitution or Textual Proof**: Re-plug your answer into the equation or cite the specific line in the passage.

Would you like me to walk through a step-by-step worked example, or give you a quick diagnostic question to practice?`;

    if (message.toLowerCase().includes('algebra') || message.toLowerCase().includes('math') || message.toLowerCase().includes('equation')) {
      reply = `### Math & Algebra Strategy Walkthrough

When solving algebraic systems and functions on standardized exams (SAT/ACT/GRE/GMAT):

- **Linear Systems**: If you see $ax + by = c$ and $dx + ey = f$, look for linear combinations (adding or subtracting equations) before solving for individual variables.
- **Discriminant Rule**: For quadratics $ax^2 + bx + c = 0$:
  - $b^2 - 4ac > 0$: Two distinct real roots
  - $b^2 - 4ac = 0$: Exactly one real root
  - $b^2 - 4ac < 0$: No real roots
- **Pacing Tip**: If an algebra question takes more than 60 seconds, check if testing numbers (e.g., $x = 2$) or graphing provides a faster path.`;
    } else if (message.toLowerCase().includes('reading') || message.toLowerCase().includes('vocab') || message.toLowerCase().includes('passage')) {
      reply = `### Reading & Verbal Strategy

For Reading and Verbal sections:
1. **Find Direct Evidence**: Every correct answer on standardized tests is directly supported by words in the passage. If an answer requires an unstated leap of assumption, it's incorrect.
2. **Context Clues for Vocabulary**: Look for contrast transition words (*however*, *despite*, *whereas*) or continuation words (*furthermore*, *moreover*) to determine the valence (positive or negative) of missing words.
3. **Main Idea vs. Detail**: Ensure your selected main idea encompasses the whole passage, not just a single compelling body paragraph.`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
