import { create } from 'zustand';

export const useMaterialStore = create((set) => ({
  materials: [],
  isLoading: false,
  error: null,

  fetchMaterials: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/materials');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке материалов');
      }
      const data = await response.json();
      set({ materials: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createMaterial: async (materialData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании материала');
      }

      const newMaterial = await response.json();
      set((state) => ({
        materials: [...state.materials, newMaterial],
        isLoading: false,
      }));
      return newMaterial;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateMaterial: async (id, materialData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении материала');
      }

      const updatedMaterial = await response.json();
      set((state) => ({
        materials: state.materials.map((material) =>
          material.id === id ? updatedMaterial : material
        ),
        isLoading: false,
      }));
      return updatedMaterial;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteMaterial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении материала');
      }

      set((state) => ({
        materials: state.materials.filter((material) => material.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
