<script setup lang="ts">
const { count, increment } = useCounter();
</script>

<template>
  <div>
    <h1>{{ capitalize("home page") }}</h1>
    <MyButton @click="increment">Clicked {{ count }}</MyButton>
  </div>
</template>
