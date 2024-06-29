'use server';

import Nutriens from '@/components/nutriens';
import { Skeleton } from '@/components/ui/skeleton';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue, streamUI } from 'ai/rsc';
import { Bot } from 'lucide-react';

const LoadingComponent = () => <Skeleton className='h-12 w-12 rounded-full' />;

const InitialNutrient = ({ nutrients, summary }: { nutrients: any; summary: string | null }) => (
  <div className={'w-full h-full'}>
    <div className='flex items-start justify-start'>
      <div className={'flex h-6 w-6 aspect-square mr-2'}>
        <Bot className='fill-zinc-300 h-3/4 w-3/4' />
      </div>

      <div className='flex flex-col items-start justify-start'>
        <p className='text-sm text-zinc-500 font-bold break-words whitespace-normal max-w-[500px] pb-2'>{summary}</p>
        <Nutriens nutrients={nutrients} />
      </div>
    </div>
  </div>
);

export async function askAi(imageUrl: string) {
  const streamableValue = createStreamableValue();

  const result = await streamUI({
    model: openai('gpt-4o'),
    initial: <LoadingComponent />,
    system: `You are a healthy eating assistant. You will be given a food image and will have to provide the nutritional information for the food image. If the image provided is not a food image, respond with "Sorry, I can only help with food images.
    
    If the image provided is a food image, respond with the following format, If the value is not available, please respond with "N/A".

    Short summary of the image, including the nutritional information with exact values without units:
    calories
    protein
    fat
    carbohydrates
    sodium`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: imageUrl,
          },
        ],
      },
    ],
    text: ({ content, done }) => {
      let nutritionalObject = {};
      let summary = null;

      const splitContent = content.split('Short summary of the image:');

      summary = splitContent[1]?.split('\n')[0].trim() ?? null;

      const infoLines = content.split('\n').slice(1);

      infoLines.forEach((line) => {
        const [key, value] = line
          .replace('- ', '')
          .split(':')
          .map((str) => str.trim());
        if (key && value) {
          nutritionalObject = { ...nutritionalObject, [key]: value };
        }
      });

      if (done) {
        streamableValue.update({
          summary,
          imageUrl,
          nutritionalObject,
        });
        streamableValue.done();
      }

      return <InitialNutrient nutrients={nutritionalObject} summary={summary} />;
    },
  });

  return { ui: result.value, stream: streamableValue.value };
}
