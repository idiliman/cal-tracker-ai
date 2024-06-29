import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  const imgUrl =
    'https://images.unsplash.com/photo-1617421753170-46511a8d73fc?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'assistant',
        content:
          'You are a helpful assistant. You will give a details breakdown of the nutrien in exact value without unit (always give me ### Total Estimated Nutritional Content: **Calories**, **Protein**, **Fat**, **Carbohydrates**, **Sodium**) by the image provided.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: imgUrl,
          },
        ],
      },
    ],
  });

  //   return result.toAIStreamResponse();

  //   for await (const textPart of result.textStream) {
  //     return NextResponse.json(process.stdout.write(textPart), { status: 200 });
  //   }

  //   for await (const textPart of result.textStream) {
  //     console.log(textPart);
  //   }

  return new NextResponse(result.textStream, { status: 200 });
}
