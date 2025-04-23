import { create } from 'zustand';

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке категорий');
      }
      const data = await response.json();
      set({ categories: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании категории');
      }

      const newCategory = await response.json();
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
      return newCategory;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении категории');
      }

      const updatedCategory = await response.json();
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        isLoading: false,
      }));
      return updatedCategory;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении категории');
      }

      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
})); 