<template>
  <div class="product-list">
    <div class="filter-row">
      <v-select
        v-model="sortBy"
        :items="sortOptions"
        label="Sắp xếp theo"
        density="comfortable"
        variant="outlined"
        hide-details
        class="sort-select"
      ></v-select>

      <v-btn-toggle v-model="viewType" mandatory>
        <v-btn value="grid">
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn value="list">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="!filteredProducts.length" class="empty-container">
      <v-icon size="large" color="grey">mdi-laptop-off</v-icon>
      <p>Không tìm thấy sản phẩm phù hợp</p>
    </div>

    <div v-else :class="['products-container', `view-${viewType}`]">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="pagination-container">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useProductStore } from "~/stores/product";

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({}),
  },
});

const productStore = useProductStore();
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(12);
const sortBy = ref("popular");
const viewType = ref("grid");

const sortOptions = [
  { title: "Phổ biến", value: "popular" },
  { title: "Mới nhất", value: "newest" },
  { title: "Giá: Thấp đến cao", value: "price_asc" },
  { title: "Giá: Cao đến thấp", value: "price_desc" },
];

// Fetch products based on filters
const fetchProducts = async () => {
  loading.value = true;
  try {
    await productStore.fetchProducts({
      page: currentPage.value,
      limit: itemsPerPage.value,
      sort: sortBy.value,
      ...props.filters,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

// Watch for changes to trigger refetch
watch([currentPage, sortBy, () => props.filters], fetchProducts, {
  immediate: true,
});

const filteredProducts = computed(() => productStore.products);
const totalProducts = computed(() => productStore.totalProducts);
const totalPages = computed(() =>
  Math.ceil(totalProducts.value / itemsPerPage.value)
);
</script>

<style lang="scss" scoped>
.product-list {
  width: 100%;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sort-select {
  width: 250px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  color: #888;
  text-align: center;
}

.products-container {
  display: grid;
  gap: 20px;
  margin-bottom: 40px;

  &.view-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  &.view-list {
    grid-template-columns: 1fr;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

@media (max-width: 768px) {
  .products-container.view-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .sort-select {
    width: 200px;
  }
}
</style>
