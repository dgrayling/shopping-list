import { create } from 'zustand';
import { CategoriesState, createCategoriesSlice } from './slices/categoriesSlice';
import createItemsSlice, { ItemsState } from './slices/itemsSlice';

// Define the combined state type
export type RootState = CategoriesState & ItemsState;

// Create the store with the slices
const useStore = create<RootState>()((...a) => ({
  ...createCategoriesSlice(...a),
  ...createItemsSlice(...a)
}));

export default useStore;
