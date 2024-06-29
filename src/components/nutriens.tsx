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
        <Card key={key} className='p-4 md:w-[200px] w-[150px] '>
          <div className='flex items-center justify-between'>
            <IconByNutrient type={key as any} />
            <div className='md:text-base text-xs'>
              <p className='capitalize '>{key}</p>
              <p className='font-bold '>{value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
