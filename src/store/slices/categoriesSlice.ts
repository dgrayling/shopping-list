import { StateCreator } from 'zustand';

export type Categorizations = {
  [key: string]: string[];
};

export interface CategoriesState {
  categorizations: Categorizations;
  newCategory: string;
  newValues: { [key: string]: string };
  editingCategory: string | null;
  editingValue: { category: string; index: number } | null;
  editTempValue: string;
  setNewCategory: (value: string) => void;
  setNewValues: (values: { [key: string]: string }) => void;
  addCategory: () => void;
  deleteCategory: (category: string) => void;
  startEditingCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  addValueToCategory: (category: string) => void;
  deleteValue: (category: string, index: number) => void;
  startEditingValue: (category: string, index: number, value: string) => void;
  updateValue: (category: string, index: number, newValue: string) => void;
}

export const createCategoriesSlice: StateCreator<
  CategoriesState,
  [],
  [],
  CategoriesState
> = (set) => ({
  categorizations: {},
  newCategory: '',
  newValues: {},
  editingCategory: null,
  editingValue: null,
  editTempValue: '',

  setNewCategory: (value) => set({ newCategory: value }),
  
  setNewValues: (values) => set({ newValues: values }),

  addCategory: () => set((state) => {
    if (!state.newCategory.trim()) return {};
    return {
      categorizations: {
        ...state.categorizations,
        [state.newCategory.trim()]: [],
      },
      newCategory: '',
    };
  }),

  deleteCategory: (category) => set((state) => {
    const newCategorizations = { ...state.categorizations };
    delete newCategorizations[category];
    return { 
      categorizations: newCategorizations,
      newValues: Object.fromEntries(
        Object.entries(state.newValues).filter(([cat]) => cat !== category)
      )
    };
  }),

  startEditingCategory: (category) => set({ 
    editingCategory: category,
    editTempValue: category,
  }),

  updateCategory: (oldCategory, newCategory) => set((state) => {
    if (!newCategory.trim() || newCategory === oldCategory) {
      return { editingCategory: null };
    }
    
    const newCategorizations = { ...state.categorizations };
    newCategorizations[newCategory] = [...(newCategorizations[oldCategory] || [])];
    delete newCategorizations[oldCategory];
    
    const newValues = { ...state.newValues };
    if (oldCategory in newValues) {
      newValues[newCategory] = newValues[oldCategory];
      delete newValues[oldCategory];
    }
    
    return {
      categorizations: newCategorizations,
      newValues,
      editingCategory: null,
    };
  }),

  addValueToCategory: (category) => set((state) => {
    const value = state.newValues[category]?.trim();
    if (!value || !state.categorizations[category]) return {};
    
    return {
      categorizations: {
        ...state.categorizations,
        [category]: [...state.categorizations[category], value],
      },
      newValues: {
        ...state.newValues,
        [category]: '',
      },
    };
  }),

  deleteValue: (category, index) => set((state) => {
    if (!state.categorizations[category]) return {};
    
    const newValues = [...state.categorizations[category]];
    newValues.splice(index, 1);
    
    return {
      categorizations: {
        ...state.categorizations,
        [category]: newValues,
      },
    };
  }),

  startEditingValue: (category, index, value) => set({
    editingValue: { category, index },
    editTempValue: value,
  }),

  updateValue: (category, index, newValue) => set((state) => {
    if (!newValue.trim() || !state.categorizations[category]) {
      return { editingValue: null };
    }
    
    const newValues = [...state.categorizations[category]];
    newValues[index] = newValue.trim();
    
    return {
      categorizations: {
        ...state.categorizations,
        [category]: newValues,
      },
      editingValue: null,
    };
  }),
}));

// Export the state interface for use in other files
export interface CategoriesState {
  categorizations: Categorizations;
  newCategory: string;
  newValues: { [key: string]: string };
  editingCategory: string | null;
  editingValue: { category: string; index: number } | null;
  editTempValue: string;
  setNewCategory: (value: string) => void;
  setNewValues: (values: { [key: string]: string }) => void;
  addCategory: () => void;
  deleteCategory: (category: string) => void;
  startEditingCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  addValueToCategory: (category: string) => void;
  deleteValue: (category: string, index: number) => void;
  startEditingValue: (category: string, index: number, value: string) => void;
  updateValue: (category: string, index: number, newValue: string) => void;
}

export default createCategoriesSlice;
