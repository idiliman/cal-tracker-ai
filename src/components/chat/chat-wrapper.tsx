'use client';

import { Button } from '../ui/button';
import { Bot, Loader, RotateCw, User } from 'lucide-react';
import { Card } from '../ui/card';
import UploadButton from './upload-button';
import { Skeleton } from '../ui/skeleton';
import NutrientsWithImage from './nutrients-with-image';

import { ReactNode, useEffect, useState, useTransition } from 'react';
import { askAi } from '@/app/actions';
import useNutrientsStore, { UserNutrients } from '@/hooks/nutriens';
import { readStreamableValue } from 'ai/rsc';
import { cn, extractNumber } from '@/lib/utils';
import Image from 'next/image';
import { format, set } from 'date-fns';

export default function ChatWrapper() {
  const [isClient, setIsClient] = useState(false);
  const [streamUi, setStreamUi] = useState<ReactNode | undefined>();
  const [streamImageUrl, setStreamImageUrl] = useState<string | undefined>();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>();
  const [toPush, setToPush] = useState<UserNutrients[]>([]);
  const [totalNutrients, setTotalNutrients] = useState<{
    calories: number | null;
    protein: number | null;
  }>({
    calories: null,
    protein: null,
  });

  const { addUserNutrients, resetUserNutrients, userNutrients } = useNutrientsStore();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (imageUrl: string) => {
    startTransition(async () => {
      try {
        const { stream, ui } = await askAi(imageUrl);

        setStreamUi(ui);

        for await (const value of readStreamableValue(stream)) {
          const nutrients = value.nutritionalObject || {}; // Handle possible undefined or null
          const calories = extractNumber(nutrients.calories);
          const protein = extractNumber(nutrients.protein);

          setToPush([{ imageUrl, nutrients: value.nutritionalObject, summary: value.summary }]);

          setTotalNutrients((prev) => ({
            calories: Number(prev.calories) + calories,
            protein: Number(prev.protein) + protein,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    });
  };
  const todayDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Card className='h-full w-full overflow-auto'>
      {/* Content */}
      <div className='justify-between flex flex-col md:max-h-[calc(100vh-100px)] md:min-h-[calc(100vh-100px)] h-[100vh] p-3'>
        <div className='flex flex-col space-y-9 py-2'>
          {selectedImageUrl && (
            <div className='flex items-end justify-end'>
              <div>
                <div className='text-center text-xs text-muted-foreground'>{todayDate}</div>
                <div className='relative aspect-square md:w-[350px] w-[300px] h-full'>
                  <Image src={selectedImageUrl} alt='image' fill className='w-full h-full object-cover rounded-md' />
                </div>
              </div>

              <div className={cn('flex h-6 w-6 aspect-square ml-2')}>
                <User className='fill-zinc-300 h-3/4 w-3/4' />
              </div>
            </div>
          )}

          {streamUi}
          {selectedImageUrl && streamUi === undefined && <InitialSkeleton />}
          {streamUi === undefined && !isPending && userNutrients.length === 0 && !selectedImageUrl && (
            <>upload something...</>
          )}
          <NutrientsWithImage />
        </div>
      </div>
      {/* Footer */}
      <div className='absolute bottom-5 md:bottom-10 left-0 right-0 flex flex-col justify-between p-3 '>
        <div className='bg-white/30 rounded-full backdrop-blur-xl border border-gray-100 w-[300px] h-[50px] mx-auto flex items-center justify-center'>
          <div className='flex items-center justify-evenly'>
            <Button disabled={isPending} variant='link'>
              {!isPending && (
                <UploadButton
                  onUploaded={(url) => {
                    handleSubmit(url);
                  }}
                  onSelect={async (files) => {
                    setStreamUi(undefined);
                    setSelectedImageUrl(undefined);

                    if (toPush.length > 0) {
                      addUserNutrients({
                        summary: toPush[0].summary,
                        imageUrl: toPush[0].imageUrl,
                        nutrients: toPush[0].nutrients,
                      });
                      setSelectedImageUrl(undefined);
                    }

                    setSelectedImageUrl(URL.createObjectURL(files[0]));

                    // setSelectedImageUrl(URL.createObjectURL(files[0]));
                  }}
                />
              )}
            </Button>
            {isPending && <Loader className='h-4 w-4 animate-spin' />}
            <Button
              disabled={isPending}
              variant='link'
              onClick={() => {
                startTransition(() => {
                  resetUserNutrients();
                  setToPush([]);
                  setStreamImageUrl(undefined);
                  setSelectedImageUrl(undefined);
                  setStreamUi(undefined);
                  totalNutrients.calories = null;
                  totalNutrients.protein = null;
                });
              }}
            >
              {!isPending && (
                <RotateCw className='md:h-10 md:w-10 h-5 w-5 text-zinc-950 md:text-zinc-700 hover:text-zinc-800 cursor-pointer hover:-translate-y-1 transition-all active:translate-y-0' />
              )}
            </Button>
            {totalNutrients.calories !== null && totalNutrients.protein !== null && isPending === false && (
              <div className='text-xs break-words whitespace-normal flex space-x-2 text-muted-foreground text-zinc-950'>
                <div>
                  Calories: <p>{totalNutrients.calories}</p>
                </div>
                <div>
                  Proteins:<p>{totalNutrients.protein}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// const updateLocalStorage = (newUserNutrients: {
//   imageUrl: string;
//   nutrients: { calories: string; protein: string; fat: string };
// }) => {
//   const existingNutrients = JSON.parse(localStorage.getItem('nutrients') || '{}');

//   const updatedNutrients = {
//     ...existingNutrients,
//     [newUserNutrients.imageUrl]: newUserNutrients.nutrients,
//   };

//   localStorage.setItem('nutrients', JSON.stringify(updatedNutrients));
// };

const InitialSkeleton = () => {
  return (
    <div className='flex flex-col space-y-9 py-2'>
      <div className='flex flex-col space-y-3'>
        {/* <div className={'flex items-end justify-end'}>
          <div>
            <div className='items-center justify-center flex pb-2'>
              <Skeleton className='w-[50px] h-4 rounded-md' />
            </div>
            <div className='relative aspect-square md:w-[450px]  w-[150px] h-full'>
              <Skeleton className='absolute top-0 left-0 right-0 bottom-0 h-full w-full' />
            </div>
          </div>

          <div className={'flex h-6 w-6 aspect-square ml-2'}>
            <User className='fill-zinc-300 h-3/4 w-3/4' />
          </div>
        </div> */}

        <div className='flex items-start justify-start'>
          <div className={'flex h-6 w-6 aspect-square mr-2'}>
            <Bot className='fill-zinc-300 h-3/4 w-3/4' />
          </div>

          <div className='flex flex-col items-start justify-start'>
            <p className='text-sm text-zinc-500 font-bold break-words whitespace-normal max-w-[500px] pb-2'>
              <Skeleton className='w-[50px] h-4 rounded-md' />
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <div className='w-full h-full'>
                <Skeleton className='h-[100px] md:w-[200px] w-[150px]' />
              </div>
              <div className='w-full h-full'>
                <Skeleton className='h-[100px] md:w-[200px] w-[150px]' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
