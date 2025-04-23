import { create } from 'zustand';

export const useFlowerStore = create((set) => ({
  flowers: [],
  isLoading: false,
  error: null,

  fetchFlowers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/flowers');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке цветов');
      }
      const data = await response.json();
      set({ flowers: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createFlower: async (flowerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/flowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowerData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании цветка');
      }

      const newFlower = await response.json();
      set((state) => ({
        flowers: [...state.flowers, newFlower],
        isLoading: false,
      }));
      return newFlower;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateFlower: async (id, flowerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/flowers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowerData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении цветка');
      }

      const updatedFlower = await response.json();
      set((state) => ({
        flowers: state.flowers.map((flower) =>
          flower.id === id ? updatedFlower : flower
        ),
        isLoading: false,
      }));
      return updatedFlower;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteFlower: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/flowers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении цветка');
      }

      set((state) => ({
        flowers: state.flowers.filter((flower) => flower.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
})); 