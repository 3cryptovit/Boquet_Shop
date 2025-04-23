import { create } from 'zustand';
import { getAllFlowers, saveCustomBouquet, addCustomBouquetToCart } from './api';

export const useConstructorStore = create((set, get) => ({
  // Состояние
  flowers: [], // Все доступные цветы
  selectedFlowers: [], // Выбранные цветы и их расположение
  isLoading: false,
  error: null,
  bouquetName: '',
  bouquetDescription: '',
  bouquetPrice: 0,
  isSaving: false,
  saveError: null,
  savedBouquetId: null,

  // Действия
  fetchFlowers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllFlowers();
      set({ flowers: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Ошибка при загрузке цветов',
        isLoading: false
      });
    }
  },

  // Обновление выбранных цветов
  setSelectedFlowers: (flowers) => {
    set({ selectedFlowers: flowers });
    // Пересчитываем цену
    get().calculatePrice();
  },

  // Добавление цветка в букет
  addFlower: (flower, position) => {
    const selectedFlowers = [...get().selectedFlowers];
    selectedFlowers.push({ ...flower, position });
    set({ selectedFlowers });
    // Пересчитываем цену
    get().calculatePrice();
  },

  // Удаление цветка из букета
  removeFlower: (index) => {
    const selectedFlowers = [...get().selectedFlowers];
    selectedFlowers.splice(index, 1);
    set({ selectedFlowers });
    // Пересчитываем цену
    get().calculatePrice();
  },

  // Обновление названия букета
  setBouquetName: (name) => set({ bouquetName: name }),

  // Обновление описания букета
  setBouquetDescription: (description) => set({ bouquetDescription: description }),

  // Расчет цены букета
  calculatePrice: () => {
    const { selectedFlowers } = get();
    const price = selectedFlowers.reduce((total, flower) => total + flower.price, 0);
    set({ bouquetPrice: price });
  },

  // Очистка конструктора
  clearConstructor: () => {
    set({
      selectedFlowers: [],
      bouquetName: '',
      bouquetDescription: '',
      bouquetPrice: 0,
      savedBouquetId: null,
      saveError: null
    });
  },

  // Сохранение букета
  saveBouquet: async () => {
    const { bouquetName, bouquetDescription, bouquetPrice, selectedFlowers } = get();

    if (selectedFlowers.length === 0) {
      set({ saveError: 'Букет должен содержать хотя бы один цветок' });
      return null;
    }

    set({ isSaving: true, saveError: null });

    try {
      const bouquetData = {
        name: bouquetName || 'Мой кастомный букет',
        description: bouquetDescription || 'Букет, созданный в конструкторе',
        price: bouquetPrice,
        flowers: selectedFlowers,
        isCustom: true
      };

      const response = await saveCustomBouquet(bouquetData);
      set({
        isSaving: false,
        savedBouquetId: response.data.id
      });

      return response.data;
    } catch (error) {
      set({
        saveError: error.response?.data?.message || 'Ошибка при сохранении букета',
        isSaving: false
      });
      return null;
    }
  },

  // Добавление букета в корзину
  addBouquetToCart: async (quantity = 1) => {
    const { savedBouquetId } = get();

    if (!savedBouquetId) {
      // Если букет еще не сохранен, сначала сохраняем
      const savedBouquet = await get().saveBouquet();
      if (!savedBouquet) return false;

      try {
        await addCustomBouquetToCart(savedBouquet.id, quantity);
        return true;
      } catch (error) {
        set({
          saveError: error.response?.data?.message || 'Ошибка при добавлении букета в корзину'
        });
        return false;
      }
    } else {
      // Если букет уже сохранен
      try {
        await addCustomBouquetToCart(savedBouquetId, quantity);
        return true;
      } catch (error) {
        set({
          saveError: error.response?.data?.message || 'Ошибка при добавлении букета в корзину'
        });
        return false;
      }
    }
  }
}));
