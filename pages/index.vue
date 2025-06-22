<script setup lang="ts">
import ProductList from "~/components/ProductList.vue";

const { count, increment } = useCounter();
// definePageMeta({
//   layout: false,
// });
//
</script>

<template>
  <div>
    <ProductList></ProductList>
  </div>
</template>
