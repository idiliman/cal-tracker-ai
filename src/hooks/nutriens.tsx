import { create } from 'zustand';

export type UserNutrients = {
  summary: string | null;
  imageUrl: string;
  nutrients: {
    calories: string;
    protein: string;
    fat: string;
    carbohydrates: string;
    sodium: string;
  };
};

type NutrientsState = {
  userNutrients: UserNutrients[];
  addUserNutrients: (newUserNutrients: {
    summary: string | null;
    imageUrl: string;
    nutrients: {
      calories: string;
      protein: string;
      fat: string;
      carbohydrates: string;
      sodium: string;
    };
  }) => void;
  resetUserNutrients: () => void;
};

const useNutrientsStore = create<NutrientsState>((set) => ({
  userNutrients: [],
  addUserNutrients: (newUserNutrients) => {
    set((state) => ({
      userNutrients: [...state.userNutrients, newUserNutrients],
    }));
  },
  resetUserNutrients: () => {
    set({
      userNutrients: [],
    });
  },
}));

export default useNutrientsStore;
