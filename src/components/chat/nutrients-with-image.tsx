import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import Nutriens from '../nutriens';
import useNutrientsStore from '@/hooks/nutriens';
import { format } from 'date-fns';
import Image from 'next/image';

const NutrientsWithImage = () => {
  const { userNutrients } = useNutrientsStore();

  const todayDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <>
      {userNutrients
        .slice() // Create a shallow copy
        .reverse() // Reverse the order
        .map((n, index) => {
          return (
            <div key={index} className={cn('w-full h-full')}>
              <div className={cn('flex flex-col space-y-3')}>
                <div className='flex items-end justify-end'>
                  <div>
                    <div className='text-center text-xs text-muted-foreground'>{todayDate}</div>
                    <div className='relative aspect-square md:w-[350px] w-[300px] h-full'>
                      <Image src={n.imageUrl} alt='image' fill className='w-full h-full object-cover rounded-md' />
                    </div>
                  </div>

                  <div className={cn('flex h-6 w-6 aspect-square ml-2')}>
                    <User className='fill-zinc-300 h-3/4 w-3/4' />
                  </div>
                </div>

                <div className='flex items-start justify-start'>
                  <div className={cn('flex h-6 w-6 aspect-square mr-2')}>
                    <Bot className='fill-zinc-300 h-3/4 w-3/4' />
                  </div>

                  <div className='flex flex-col items-start justify-start'>
                    <p className='md:text-sm text-xs text-zinc-500 font-bold break-words whitespace-normal max-w-[500px] pb-2'>
                      {n.summary && n.summary?.length > 0 ? n.summary : 'Food image only 🫡'}
                    </p>
                    <Nutriens nutrients={n.nutrients} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default NutrientsWithImage;
