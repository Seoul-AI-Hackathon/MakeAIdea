import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nodeId, answer } = await request.json();

    const response = await fetch('http://127.0.0.1:8000/answer/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeId,
        answer,
      }),
    });

    if (!response.ok) {
      throw new Error('External API request failed');
    }

    const data = await response.json();
    console.log(data)
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in answer API:', error);
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    );
  }
} 