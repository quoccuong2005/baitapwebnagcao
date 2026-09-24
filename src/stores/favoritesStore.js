import { create } from 'zustand'

export const useFavoritesStore = create((set) => ({
  favoriteIds: [],
  toggleFavorite: (productId) => set((state) => ({
    favoriteIds: state.favoriteIds.includes(productId)
      ? state.favoriteIds.filter((id) => id !== productId)
      : [...state.favoriteIds, productId],
  })),
}))