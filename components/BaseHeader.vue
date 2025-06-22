<template>
  <v-app-bar class="header" color="primary" app flat>
    <v-container class="d-flex align-center">
      <router-link to="/" class="text-decoration-none">
        <v-img :src="logo" width="120" height="40" alt="Logo" />
      </router-link>
      <v-spacer></v-spacer>

      <div class="search-container">
        <v-text-field
          v-model="searchQuery"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          placeholder="Tìm kiếm laptop..."
          hide-details
          class="search-field"
          @keyup.enter="handleSearch"
        ></v-text-field>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-btn icon @click="toggleFavorites">
          <v-icon>mdi-heart</v-icon>
          <v-badge
            v-if="favoriteCount > 0"
            :content="favoriteCount"
            color="error"
            dot
          ></v-badge>
        </v-btn>

        <v-btn icon class="ml-4" @click="toggleCart">
          <v-icon>mdi-cart</v-icon>
          <v-badge
            v-if="cartItemCount > 0"
            :content="cartItemCount"
            color="error"
          ></v-badge>
        </v-btn>

        <v-btn icon class="ml-4" @click="toggleUserMenu">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>

  <!-- <v-navigation-drawer v-model="cartDrawer" location="right" temporary>
    <CartDrawer @close="cartDrawer = false" />
  </v-navigation-drawer> -->

  <v-menu v-model="userMenu" :close-on-content-click="false" location="bottom">
    <v-card min-width="200">
      <v-list>
        <v-list-item
          prepend-icon="mdi-account"
          title="Tài khoản"
          to="/account"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-history"
          title="Đơn hàng"
          to="/orders"
        ></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Đăng xuất"
          @click="logout"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useFavoriteStore } from "~/stores/favorite";
import logo from "~/assets/images/logo.png";
const router = useRouter();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const searchQuery = ref("");

const userMenu = ref(false);

const cartItemCount = computed(() => cartStore.totalItems);
const favoriteCount = computed(() => favoriteStore.totalItems);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: "/search", query: { q: searchQuery.value } });
    searchQuery.value = "";
  }
};

const toggleCart = () => {
  // cartDrawer.value = !cartDrawer.value;
  router.push("/cart");
};

const toggleFavorites = () => {
  router.push("/favorites");
};

const toggleUserMenu = () => {
  userMenu.value = !userMenu.value;
};

const logout = () => {
  // Implement logout logic
  userMenu.value = false;
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.search-container {
  width: 40%;
  max-width: 450px;
}

.search-field {
  border-radius: 24px;
}

@media (max-width: 768px) {
  .search-container {
    width: 60%;
  }
}
</style>
