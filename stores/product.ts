import { defineStore } from "pinia";
import axios from "axios";
import { productApi } from "@/services/api";
interface ProductFilter {
  page?: number;
  limit?: number;
  sort?: string;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    totalProducts: 0,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProducts(filters: ProductFilter = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productApi.getProducts({
          params: {
            _page: filters.page || 1,
            _limit: filters.limit || 12,
            _sort: filters.sort?.split("_")[0] || "popular",
            _order: filters.sort?.split("_")[1] || "desc",
            brandId: filters.brandId,
            categoryId: filters.categoryId,
            price_gte: filters.minPrice,
            price_lte: filters.maxPrice,
            q: filters.search,
          },
        });
        console.log("Response data:", response.data);

        this.products = response.data;
        this.totalProducts = parseInt(response.headers["x-total-count"] || "0");
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await productApi.getProductById(id);
        return response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);

        return null;
      } finally {
        this.loading = false;
      }
    },

    async searchProducts(query: string) {
      return this.fetchProducts({ search: query });
    },
  },
});
