import axios from "axios";

// Create an axios instance with base settings
const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          console.error("Unauthorized access");
          // router.push('/login');
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("API request failed");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

// Product API functions
export const productApi = {
  getProducts(params = {}) {
    return api.get("/products", { params });
  },

  getProductById(id: number) {
    return api.get(`/products/${id}`);
  },

  searchProducts(query: string) {
    return api.get("/products", { params: { q: query } });
  },
};

// Cart API functions
export const cartApi = {
  getCart() {
    return api.get("/cart");
  },

  addToCart(productId: number, quantity: number) {
    return api.post("/cart", { productId, quantity });
  },

  updateCartItem(itemId: number, quantity: number) {
    return api.put(`/cart/${itemId}`, { quantity });
  },

  removeCartItem(itemId: number) {
    return api.delete(`/cart/${itemId}`);
  },
};

// User API functions
export const userApi = {
  login(email: string, password: string) {
    return api.post("/auth/login", { email, password });
  },

  register(userData: object) {
    return api.post("/auth/register", userData);
  },

  getProfile() {
    return api.get("/user/profile");
  },

  updateProfile(userData: object) {
    return api.put("/user/profile", userData);
  },
};

// Order API functions
export const orderApi = {
  createOrder(orderData: object) {
    return api.post("/orders", orderData);
  },

  getOrders() {
    return api.get("/orders");
  },

  getOrderById(id: number) {
    return api.get(`/orders/${id}`);
  },
};

export default api;
