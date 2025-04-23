import { create } from 'zustand';

export const useBouquetStore = create((set) => ({
  bouquets: [],
  isLoading: false,
  error: null,

  fetchBouquets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/bouquets');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке букетов');
      }
      const data = await response.json();
      set({ bouquets: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBouquetById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/bouquets/${id}`);
      if (!response.ok) {
        throw new Error('Букет не найден');
      }
      const data = await response.json();
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createBouquet: async (bouquetData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/bouquets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bouquetData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании букета');
      }

      const newBouquet = await response.json();
      set((state) => ({
        bouquets: [...state.bouquets, newBouquet],
        isLoading: false,
      }));
      return newBouquet;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateBouquet: async (id, bouquetData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/bouquets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bouquetData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении букета');
      }

      const updatedBouquet = await response.json();
      set((state) => ({
        bouquets: state.bouquets.map((bouquet) =>
          bouquet.id === id ? updatedBouquet : bouquet
        ),
        isLoading: false,
      }));
      return updatedBouquet;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteBouquet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/bouquets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении букета');
      }

      set((state) => ({
        bouquets: state.bouquets.filter((bouquet) => bouquet.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
})); 