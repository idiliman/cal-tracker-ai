'use server';

import Nutriens from '@/components/nutriens';
import { Skeleton } from '@/components/ui/skeleton';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue, streamUI } from 'ai/rsc';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';

const LoadingComponent = () => <Skeleton className='h-12 w-12 rounded-full' />;

const todayDate = format(new Date(), 'yyyy-MM-dd');

const InitialNutrient = ({
  nutrients,
  summary,
  imageUrl,
}: {
  nutrients: any;
  summary: string | null;
  imageUrl: string;
}) => (
  <div className={'w-full h-full'}>
    <div className={'flex flex-col space-y-3'}>
      <div className='flex items-end justify-end'>
        <div>
          <div className='text-center text-xs text-muted-foreground'>{todayDate}</div>
          <div className='relative aspect-square md:w-[300px] w-[250] h-full blurred-img'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt='image'
              loading='lazy'
              width={300}
              height={300}
              className='w-full h-full object-cover rounded-md'
            />
          </div>
        </div>

        <div className={'flex h-6 w-6 aspect-square ml-2'}>
          <User className='fill-zinc-300 h-3/4 w-3/4' />
        </div>
      </div>

      <div className='flex items-start justify-start'>
        <div className={'flex h-6 w-6 aspect-square mr-2'}>
          <Bot className='fill-zinc-300 h-3/4 w-3/4' />
        </div>

        <div className='flex flex-col items-start justify-start'>
          <p className='md:text-sm text-xs text-zinc-500 font-bold break-words whitespace-normal max-w-[500px] pb-2'>
            {summary}
          </p>
          <Nutriens nutrients={nutrients} />
        </div>
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

      return <InitialNutrient nutrients={nutritionalObject} summary={summary} imageUrl={imageUrl} />;
    },
  });

  return { ui: result.value, stream: streamableValue.value };
}
