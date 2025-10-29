import { StateCreator } from 'zustand';

export type CategoryValue = {
  category: string;
  value: string;
};

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  quantity: number;
  aisle?: string;
  categoryValues?: CategoryValue[];
}

interface ItemsState {
  items: ListItem[];
  editingQuantityId: string | null;
  tempQuantity: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  addItem: (text: string) => void;
  toggleComplete: (id: string) => void;
  deleteItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  decrementQuantity: (id: string) => void;
  incrementQuantity: (id: string) => void;
  setEditingQuantityId: (id: string | null) => void;
  setTempQuantity: (value: string) => void;
  addCategoryValue: (itemId: string, category: string, value: string) => void;
  removeCategoryValue: (itemId: string, category: string) => void;
}

export const createItemsSlice: StateCreator<
  ItemsState,
  [],
  [],
  ItemsState
> = (set) => ({
  items: [
    { id: '1', text: 'Apples', quantity: 10, completed: false },
    { id: '2', text: 'Honey', quantity: 2, completed: false },
    { id: '3', text: 'Yogurt', quantity: 3, completed: false }
  ],
  editingQuantityId: null,
  tempQuantity: '',
  inputValue: '',
  
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

  addCategoryValue: (itemId, category, value) => set((state) => {
    const item = state.items.find(item => item.id === itemId);
    if (!item) return {};

    const categoryValues = item.categoryValues || [];
    const existingIndex = categoryValues.findIndex(cv => cv.category === category);
    
    if (existingIndex >= 0) {
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

  removeCategoryValue: (itemId, category) => set((state) => ({
    items: state.items.map(item => 
      item.id === itemId && item.categoryValues
        ? { 
            ...item, 
            categoryValues: item.categoryValues.filter(cv => cv.category !== category) 
          }
        : item
    )
  })),
}));

// Export the state interface for use in other files
export interface ItemsState {
  items: ListItem[];
  editingQuantityId: string | null;
  tempQuantity: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  addItem: (text: string) => void;
  toggleComplete: (id: string) => void;
  deleteItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  decrementQuantity: (id: string) => void;
  incrementQuantity: (id: string) => void;
  setEditingQuantityId: (id: string | null) => void;
  setTempQuantity: (value: string) => void;
  addCategoryValue: (itemId: string, category: string, value: string) => void;
  removeCategoryValue: (itemId: string, category: string) => void;
}

export default createItemsSlice;
