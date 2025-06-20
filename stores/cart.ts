import { defineStore } from "pinia";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    shippingFee: 30000, // Default shipping fee
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    subtotal: (state) => {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    // total: (state) => {
    //   return state.subtotal + state.shippingFee;
    // },

    isEmpty: (state) => {
      return state.items.length === 0;
    },
  },

  actions: {
    addItem(item: CartItem) {
      const existingItem = this.items.find(
        (i) => i.productId === item.productId
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push({ ...item });
      }

      this.saveToLocalStorage();
    },

    updateItemQuantity(productId: number, change: number) {
      const item = this.items.find((i) => i.productId === productId);

      if (item) {
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = newQuantity;
        }

        this.saveToLocalStorage();
      }
    },

    removeItem(productId: number) {
      const index = this.items.findIndex((i) => i.productId === productId);

      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    loadFromLocalStorage() {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        try {
          this.items = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }
    },
  },
});
