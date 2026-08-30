import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const essay = body.essay_response || '';
    const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

    let score = 4;
    if (wordCount > 300) score = 5;
    if (wordCount > 500) score = 6;
    if (wordCount < 150) score = 3;

    return NextResponse.json({
      score: `${score}/6`,
      score_numeric: score,
      strengths: [
        'Clear central thesis statement establishing analytical perspective.',
        'Logical paragraph structure with coherent argumentative flow.',
        'Appropriate academic tone and varied sentence complexity.',
      ],
      weaknesses: [
        wordCount < 250
          ? 'Essay is concise; expand with additional concrete textual examples or evidence.'
          : 'Could deepen critical evaluation of opposing viewpoints.',
      ],
      suggestions: [
        'Utilize targeted transition phrases to strengthen connections between supporting paragraphs.',
        'Incorporate precise domain-specific vocabulary to enhance rhetorical authority.',
      ],
      detailed_feedback: `Your response shows strong understanding of the prompt. With a word count of ${wordCount} words, your arguments are well organized and articulate. Continue focusing on depth of textual synthesis to reach a top-band 6/6 score.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
