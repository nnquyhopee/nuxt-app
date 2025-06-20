<script setup lang="ts">
const { count, increment } = useCounter();
</script>

<template>
  <div>
    <h1>{{ capitalize("home page") }}</h1>
    <MyButton @click="increment">Clicked {{ count }}</MyButton>

    <v-icon size="48">mdi-home</v-icon>
    <p>Hello Vuetify!</p>
  </div>
</template>
