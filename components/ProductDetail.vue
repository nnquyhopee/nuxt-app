<template>
  <div>
    <v-container v-if="loading">
      <div class="loading-container">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </div>
    </v-container>

    <v-container v-else-if="!product">
      <div class="not-found">
        <h2>Sản phẩm không tồn tại hoặc đã bị xóa</h2>
        <v-btn color="primary" to="/" class="mt-4">Quay lại trang chủ</v-btn>
      </div>
    </v-container>

    <v-container v-else>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

      <div class="product-detail">
        <div class="product-gallery">
          <v-carousel hide-delimiters show-arrows="hover" height="400">
            <v-carousel-item
              v-for="(image, i) in product.images"
              :key="i"
              :src="image"
              cover
            ></v-carousel-item>
          </v-carousel>

          <div class="thumbnail-row">
            <div
              v-for="(image, i) in product.images"
              :key="i"
              class="thumbnail"
              :class="{ active: currentImageIndex === i }"
              @click="currentImageIndex = i"
            >
              <v-img :src="image" height="60" cover></v-img>
            </div>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>

          <div class="product-meta">
            <div class="brand">
              <span>Thương hiệu:</span> {{ product.brand }}
            </div>
            <div
              class="stock-status"
              :class="product.inStock ? 'in-stock' : 'out-stock'"
            >
              {{ product.inStock ? "Còn hàng" : "Hết hàng" }}
            </div>
          </div>

          <div class="price-section">
            <div class="current-price">{{ formatPrice(product.price) }}</div>
            <div class="original-price" v-if="product.discountPercentage > 0">
              {{ formatPrice(calculateOriginalPrice()) }}
            </div>
            <div class="discount-badge" v-if="product.discountPercentage > 0">
              -{{ product.discountPercentage }}%
            </div>
          </div>

          <div class="specs-section">
            <h3>Cấu hình chi tiết</h3>
            <div class="specs-table">
              <div class="spec-row">
                <div class="spec-label">CPU</div>
                <div class="spec-value">{{ product.cpu }}</div>
              </div>
              <div class="spec-row">
                <div class="spec-label">RAM</div>
                <div class="spec-value">{{ product.ram }}</div>
              </div>
              <div class="spec-row">
                <div class="spec-label">Ổ cứng</div>
                <div class="spec-value">{{ product.storage }}</div>
              </div>
              <div class="spec-row">
                <div class="spec-label">Card đồ họa</div>
                <div class="spec-value">{{ product.gpu }}</div>
              </div>
              <div class="spec-row">
                <div class="spec-label">Màn hình</div>
                <div class="spec-value">{{ product.display }}</div>
              </div>
              <div class="spec-row">
                <div class="spec-label">Hệ điều hành</div>
                <div class="spec-value">{{ product.os }}</div>
              </div>
              <div class="spec-row">
                <div class="spec-label">Trọng lượng</div>
                <div class="spec-value">{{ product.weight }}</div>
              </div>
            </div>
          </div>

          <div class="actions-section">
            <div class="quantity-selector">
              <v-btn
                icon
                variant="outlined"
                size="small"
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="quantity">{{ quantity }}</span>
              <v-btn
                icon
                variant="outlined"
                size="small"
                @click="increaseQuantity"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>

            <v-btn
              color="primary"
              size="large"
              :disabled="!product.inStock"
              @click="addToCart"
              class="add-to-cart-btn"
            >
              <v-icon left>mdi-cart</v-icon>
              Thêm vào giỏ hàng
            </v-btn>

            <v-btn
              icon
              variant="outlined"
              size="large"
              @click="toggleFavorite"
              class="favorite-btn"
              :color="isFavorite ? 'red' : ''"
            >
              <v-icon>{{
                isFavorite ? "mdi-heart" : "mdi-heart-outline"
              }}</v-icon>
            </v-btn>
          </div>

          <div class="promotion-section">
            <h3>Khuyến mãi</h3>
            <ul>
              <li v-for="(promo, i) in product.promotions" :key="i">
                <v-icon color="green" size="small">mdi-check-circle</v-icon>
                {{ promo }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="description-section">
        <h2>Mô tả sản phẩm</h2>
        <div class="description" v-html="product.description"></div>
      </div>

      <div class="related-products">
        <h2>Sản phẩm tương tự</h2>
        <div class="related-grid">
          <ProductCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "~/stores/product";
import { useCartStore } from "~/stores/cart";
import { useFavoriteStore } from "~/stores/favorite";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const loading = ref(true);
const product = ref(null);
const relatedProducts = ref([]);
const quantity = ref(1);
const currentImageIndex = ref(0);

onMounted(async () => {
  try {
    const productId = Number(route.params.id);
    if (isNaN(productId)) return;

    product.value = await productStore.fetchProductById(productId);
    relatedProducts.value = await productStore.fetchRelatedProducts(productId);
  } catch (error) {
    console.error("Error loading product:", error);
  } finally {
    loading.value = false;
  }
});

const breadcrumbs = computed(() => {
  if (!product.value) return [];

  return [
    { title: "Trang chủ", to: "/" },
    { title: product.value.brand, to: `/brand/${product.value.brandId}` },
    { title: product.value.name, disabled: true },
  ];
});

const isFavorite = computed(() => {
  if (!product.value) return false;
  return favoriteStore.isFavorite(product.value.id);
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const calculateOriginalPrice = (): number => {
  if (!product.value) return 0;
  return product.value.price / (1 - product.value.discountPercentage / 100);
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (!product.value || !product.value.inStock) return;

  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    price: product.value.price,
    quantity: quantity.value,
    thumbnail: product.value.images[0],
  });
};

const toggleFavorite = () => {
  if (!product.value) return;

  if (isFavorite.value) {
    favoriteStore.removeItem(product.value.id);
  } else {
    favoriteStore.addItem({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      thumbnail: product.value.images[0],
    });
  }
};
</script>

<style lang="scss" scoped>
.loading-container,
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 500px;
  text-align: center;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.product-gallery {
  .thumbnail-row {
    display: flex;
    gap: 8px;
    margin-top: 10px;
    overflow-x: auto;

    .thumbnail {
      width: 70px;
      height: 60px;
      border: 1px solid #ddd;
      cursor: pointer;
      opacity: 0.7;
      transition:
        opacity 0.2s,
        border-color 0.2s;

      &:hover,
      &.active {
        opacity: 1;
        border-color: #1976d2;
      }
    }
  }
}

.product-title {
  font-size: 1.8rem;
  margin-bottom: 16px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.95rem;

  .brand span {
    color: #666;
  }

  .stock-status {
    font-weight: bold;

    &.in-stock {
      color: #4caf50;
    }

    &.out-stock {
      color: #f44336;
    }
  }
}

.price-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .current-price {
    font-size: 2rem;
    font-weight: bold;
    color: #f44336;
  }

  .original-price {
    margin-left: 12px;
    text-decoration: line-through;
    color: #666;
  }

  .discount-badge {
    margin-left: 12px;
    background-color: #f44336;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
  }
}

.specs-section {
  margin-bottom: 30px;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }

  .specs-table {
    .spec-row {
      display: flex;
      border-bottom: 1px solid #eee;
      padding: 8px 0;

      &:last-child {
        border-bottom: none;
      }

      .spec-label {
        width: 120px;
        color: #666;
      }

      .spec-value {
        flex: 1;
        font-weight: 500;
      }
    }
  }
}

.actions-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  .quantity-selector {
    display: flex;
    align-items: center;
    margin-right: 16px;

    .quantity {
      width: 40px;
      text-align: center;
      font-weight: bold;
    }
  }

  .add-to-cart-btn {
    flex: 1;
  }

  .favorite-btn {
    margin-left: 16px;
  }
}

.promotion-section {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }

  ul {
    padding-left: 10px;

    li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;

      .v-icon {
        margin-right: 8px;
        margin-top: 2px;
      }
    }
  }
}

.description-section {
  margin-bottom: 40px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
}

.related-products {
  margin-bottom: 60px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}
</style>
