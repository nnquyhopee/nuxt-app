<template>
  <v-card class="product-card" @click="navigateToProduct">
    <div class="product-image-container">
      <v-img
        :src="product.thumbnail"
        :alt="product.name"
        class="product-image"
        height="200"
        cover
      >
        <div class="discount-badge" v-if="product.discountPercentage > 0">
          -{{ product.discountPercentage }}%
        </div>
      </v-img>
      <v-btn
        icon
        size="small"
        color="red"
        variant="text"
        class="favorite-btn"
        @click.stop="toggleFavorite"
      >
        <v-icon>{{ isFavorite ? "mdi-heart" : "mdi-heart-outline" }}</v-icon>
      </v-btn>
    </div>

    <v-card-title class="product-title">{{ product.name }}</v-card-title>

    <v-card-subtitle>
      <div class="specs">
        <div><v-icon size="small">mdi-memory</v-icon> {{ product.cpu }}</div>
        <div><v-icon size="small">mdi-database</v-icon> {{ product.ram }}</div>
        <div>
          <v-icon size="small">mdi-harddisk</v-icon> {{ product.storage }}
        </div>
        <div v-if="product.gpu">
          <v-icon size="small">mdi-gpu</v-icon> {{ product.gpu }}
        </div>
      </div>
    </v-card-subtitle>

    <v-card-text class="price-container">
      <div class="price">{{ formatPrice(product.price) }}</div>
      <div class="original-price" v-if="product.discountPercentage > 0">
        {{ formatPrice(calculateOriginalPrice()) }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" variant="tonal" block @click.stop="addToCart">
        Thêm vào giỏ
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useFavoriteStore } from "~/stores/favorite";

interface ProductProps {
  product: {
    id: number;
    name: string;
    thumbnail: string;
    price: number;
    discountPercentage: number;
    cpu: string;
    ram: string;
    storage: string;
    gpu?: string;
  };
}

const props = defineProps<ProductProps>();
const router = useRouter();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const isFavorite = computed(() => favoriteStore.isFavorite(props.product.id));

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const calculateOriginalPrice = (): number => {
  return props.product.price / (1 - props.product.discountPercentage / 100);
};

const navigateToProduct = () => {
  router.push(`/product/${props.product.id}`);
};

const addToCart = () => {
  cartStore.addItem({
    productId: props.product.id,
    name: props.product.name,
    price: props.product.price,
    quantity: 1,
    thumbnail: props.product.thumbnail,
  });
};

const toggleFavorite = () => {
  if (isFavorite.value) {
    favoriteStore.removeItem(props.product.id);
  } else {
    favoriteStore.addItem({
      id: props.product.id,
      name: props.product.name,
      price: props.product.price,
      thumbnail: props.product.thumbnail,
    });
  }
};
</script>

<style lang="scss" scoped>
.product-card {
  position: relative;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

    .favorite-btn {
      opacity: 1;
    }
  }
}

.product-image-container {
  position: relative;
}

.product-image {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff4c4c;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.product-title {
  font-size: 1rem;
  height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.specs {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.price {
  font-weight: bold;
  color: #ff4c4c;
  font-size: 1.2rem;
}

.original-price {
  text-decoration: line-through;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
