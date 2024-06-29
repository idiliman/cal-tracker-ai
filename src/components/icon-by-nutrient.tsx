import { Croissant, Drumstick, Flame, Pizza, Popcorn } from 'lucide-react';
import React from 'react';
import { Skeleton } from './ui/skeleton';

interface Props {
  type: 'calories' | 'protein' | 'fat' | 'carbohydrates' | 'sodium' | undefined;
}

export default function IconByNutrient({ type }: Props) {
  return (
    <div>
      {type === undefined && (
        <>
          <Skeleton className='w-8 h-8 animate-spin' />
        </>
      )}
      {type === 'calories' && <Flame className='w-8 h-8  text-slate-600' />}
      {type === 'protein' && <Drumstick className='w-8 h-8  text-slate-600' />}
      {type === 'fat' && <Pizza className='w-8 h-8  text-slate-600' />}
      {type === 'carbohydrates' && <Croissant className='w-8 h-8 text-slate-600' />}
      {type === 'sodium' && <Popcorn className='w-8 h-8  text-slate-600' />}
    </div>
  );
}
