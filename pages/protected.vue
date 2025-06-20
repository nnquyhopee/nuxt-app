<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div>
    <h2>Protected Page</h2>
    <p>You are authenticated and can view this.</p>
  </div>
</template>
