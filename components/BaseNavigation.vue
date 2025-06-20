<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item
        prepend-icon="mdi-laptop"
        title="Tất cả laptop"
        value="all"
        to="/"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-subheader>Thương hiệu</v-list-subheader>
      <v-list-item
        v-for="brand in brands"
        :key="brand.id"
        :title="brand.name"
        :value="brand.id"
        :to="`/brand/${brand.id}`"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-subheader>Mục đích sử dụng</v-list-subheader>
      <v-list-item
        v-for="category in categories"
        :key="category.id"
        :title="category.name"
        :value="category.id"
        :to="`/category/${category.id}`"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-subheader>Khoảng giá</v-list-subheader>
      <v-list-item
        v-for="priceRange in priceRanges"
        :key="priceRange.id"
        :title="priceRange.label"
        :value="priceRange.id"
        :to="`/price-range/${priceRange.id}`"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface PriceRange {
  id: number;
  label: string;
  min: number;
  max: number | null;
}

const brands = ref<Brand[]>([
  { id: 1, name: "Apple" },
  { id: 2, name: "Dell" },
  { id: 3, name: "HP" },
  { id: 4, name: "Lenovo" },
  { id: 5, name: "Asus" },
  { id: 6, name: "Acer" },
  { id: 7, name: "MSI" },
]);

const categories = ref<Category[]>([
  { id: 1, name: "Gaming" },
  { id: 2, name: "Văn phòng" },
  { id: 3, name: "Thiết kế đồ họa" },
  { id: 4, name: "Mỏng nhẹ" },
  { id: 5, name: "Sinh viên" },
]);

const priceRanges = ref<PriceRange[]>([
  { id: 1, label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { id: 2, label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { id: 3, label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { id: 4, label: "20 - 30 triệu", min: 20000000, max: 30000000 },
  { id: 5, label: "Trên 30 triệu", min: 30000000, max: null },
]);
</script>
