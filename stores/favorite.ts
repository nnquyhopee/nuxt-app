import { defineStore } from "pinia";

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
}

export const useFavoriteStore = defineStore("favorite", {
  state: () => ({
    items: [] as FavoriteItem[],
  }),

  getters: {
    totalItems: (state) => {
      return state.items.length;
    },

    isFavorite: (state) => (productId: number) => {
      return state.items.some((item) => item.id === productId);
    },
  },

  actions: {
    addItem(item: FavoriteItem) {
      if (!this.isFavorite(item.id)) {
        this.items.push({ ...item });
        this.saveToLocalStorage();
      }
    },

    removeItem(productId: number) {
      const index = this.items.findIndex((item) => item.id === productId);

      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    clearAll() {
      this.items = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem("favorites", JSON.stringify(this.items));
    },

    loadFromLocalStorage() {
      const savedFavorites = localStorage.getItem("favorites");

      if (savedFavorites) {
        try {
          this.items = JSON.parse(savedFavorites);
        } catch (e) {
          console.error("Failed to parse favorites from localStorage", e);
        }
      }
    },
  },
});
