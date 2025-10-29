import { create } from 'zustand';

export type CategoryValue = {
  category: string;
  value: string;
};

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
  quantity: number;
  aisle?: string;
  categoryValues?: CategoryValue[];
};

type Categorizations = {
  [key: string]: string[];
};

interface ShoppingListState {
  items: ListItem[];
  categorizations: Categorizations;
  inputValue: string;
  editingQuantityId: string | null;
  tempQuantity: string;
  newCategory: string;
  newValues: { [key: string]: string };
  editingCategory: string | null;
  editingValue: { category: string; index: number } | null;
  editTempValue: string;
  
  // Actions
  setInputValue: (value: string) => void;
  addItem: (text: string) => void;
  toggleComplete: (id: string) => void;
  deleteItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  decrementQuantity: (id: string) => void;
  incrementQuantity: (id: string) => void;
  setEditingQuantityId: (id: string | null) => void;
  setTempQuantity: (value: string) => void;
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
  addCategoryValue: (itemId: string, category: string, value: string) => void;
  removeCategoryValue: (itemId: string, category: string) => void;
}

const useShoppingListStore = create<ShoppingListState>((set) => ({
  // Initial state
  items: [
    { id: '1', text: 'Apples', quantity: 10, completed: false },
    { id: '2', text: 'Honey', quantity: 2, completed: false },
    { id: '3', text: 'Yogurt', quantity: 3, completed: false }
  ],
  categorizations: {},
  inputValue: '',
  editingQuantityId: null,
  tempQuantity: '',
  newCategory: '',
  newValues: {},
  editingCategory: null,
  editingValue: null,
  editTempValue: '',

  // Actions
  setInputValue: (value) => set({ inputValue: value }),
  
  addItem: (text) => set((state) => ({
    items: [
      ...state.items,
      {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        quantity: 1,
      },
    ],
    inputValue: '',
  })),

  toggleComplete: (id) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ),
  })),

  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  updateQuantity: (id, newQuantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id 
        ? { ...item, quantity: Math.max(1, Math.min(99, newQuantity)) } 
        : item
    ),
  })),

  decrementQuantity: (id) => set((state) => {
    const item = state.items.find((i) => i.id === id);
    if (!item) return {};
    return {
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      ),
    };
  }),

  incrementQuantity: (id) => set((state) => {
    const item = state.items.find((i) => i.id === id);
    if (!item) return {};
    return {
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i
      ),
    };
  }),

  setEditingQuantityId: (id) => set({ editingQuantityId: id }),
  
  setTempQuantity: (value) => set({ tempQuantity: value }),
  
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
    return { categorizations: newCategorizations };
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
    
    return {
      categorizations: newCategorizations,
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

  addCategoryValue: (itemId, category, value) => set((state) => {
    const item = state.items.find(item => item.id === itemId);
    if (!item) return {};

    const categoryValues = item.categoryValues || [];
    const existingIndex = categoryValues.findIndex(cv => cv.category === category);
    
    if (existingIndex >= 0) {
      // Update existing category value
      const updatedValues = [...categoryValues];
      updatedValues[existingIndex] = { category, value };
      
      return {
        items: state.items.map(i => 
          i.id === itemId 
            ? { ...i, categoryValues: updatedValues } 
            : i
        )
      };
    } else {
      // Add new category value
      return {
        items: state.items.map(i => 
          i.id === itemId 
            ? { 
                ...i, 
                categoryValues: [...categoryValues, { category, value }] 
              } 
            : i
        )
      };
    }
  }),

  removeCategoryValue: (itemId, category) => set((state) => {
    return {
      items: state.items.map(item => 
        item.id === itemId && item.categoryValues
          ? { 
              ...item, 
              categoryValues: item.categoryValues.filter(cv => cv.category !== category) 
            }
          : item
      )
    };
  }),
}));

export default useShoppingListStore;
