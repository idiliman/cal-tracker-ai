import { Card } from './ui/card';
import IconByNutrient from './icon-by-nutrient';

interface Props {
  nutrients:
    | {
        calories: string;
        protein: string;
        fat: string;
        carbohydrates: string;
        sodium: string;
      }
    | undefined;
}
export default function Nutriens({ nutrients }: Props) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      {Object.entries(nutrients ?? {}).map(([key, value]) => (
        <Card key={key} className='p-4 w-[200px] '>
          <div className='flex items-center justify-between'>
            <IconByNutrient type={key as any} />
            <div>
              <p className='capitalize text-base'>{key}</p>
              <p className='font-bold'>{value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
