import { defineStore } from "pinia";
import axios from "axios";

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
    error: null as Error | null,
  }),

  actions: {
    async fetchProducts(filters: ProductFilter = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/api/products", {
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

        this.products = response.data;
        this.totalProducts = parseInt(response.headers["x-total-count"] || "0");
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = error as Error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`/api/products/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        this.error = error as Error;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchRelatedProducts(productId: number) {
      try {
        const product = await this.fetchProductById(productId);

        if (!product) return [];

        const response = await axios.get("/api/products", {
          params: {
            brandId: product.brandId,
            id_ne: productId,
            _limit: 4,
          },
        });

        return response.data;
      } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
      }
    },

    async searchProducts(query: string) {
      return this.fetchProducts({ search: query });
    },
  },
});
