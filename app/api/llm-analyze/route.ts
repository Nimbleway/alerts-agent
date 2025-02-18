import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        prompt: prompt,
        max_tokens: 200,
      }),
    });

    const result = await response.json();
    console.log('LLM response:', result);

    const message = result.choices && result.choices.length > 0
      ? result.choices[0].text
      : 'No response from LLM';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('LLM request failed:', error);
    return NextResponse.json({ error: 'LLM request failed' }, { status: 500 });
  }
}
