<template>
  <div class="cart-drawer">
    <div class="cart-header">
      <h2>Giỏ hàng ({{ cartStore.totalItems }})</h2>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <div v-if="cartStore.isEmpty" class="empty-cart">
      <v-icon size="64" color="grey lighten-1">mdi-cart-outline</v-icon>
      <p>Giỏ hàng của bạn đang trống</p>
      <v-btn color="primary" @click="$emit('close')">Tiếp tục mua sắm</v-btn>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="cart-item"
        >
          <div class="item-image">
            <v-img :src="item.thumbnail" height="80" width="80" cover></v-img>
          </div>

          <div class="item-details">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-price">{{ formatPrice(item.price) }}</div>

            <div class="item-actions">
              <div class="quantity-control">
                <v-btn
                  size="x-small"
                  icon
                  variant="text"
                  @click="decreaseQuantity(item.productId)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="quantity">{{ item.quantity }}</span>
                <v-btn
                  size="x-small"
                  icon
                  variant="text"
                  @click="increaseQuantity(item.productId)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-btn
                size="x-small"
                icon
                variant="text"
                color="error"
                @click="removeItem(item.productId)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Tạm tính</span>
          <span>{{ formatPrice(cartStore.subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>Phí vận chuyển</span>
          <span>{{ formatPrice(cartStore.shippingFee) }}</span>
        </div>
        <div class="summary-row total">
          <span>Tổng cộng</span>
          <span>{{ formatPrice(cartStore.total) }}</span>
        </div>
      </div>

      <div class="cart-actions">
        <v-btn block color="primary" size="large" to="/checkout">
          Tiến hành thanh toán
        </v-btn>
        <v-btn block variant="outlined" class="mt-2" @click="$emit('close')">
          Tiếp tục mua sắm
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from "~/stores/cart";

defineEmits(["close"]);

const cartStore = useCartStore();

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const increaseQuantity = (productId: number) => {
  cartStore.updateItemQuantity(productId, 1);
};

const decreaseQuantity = (productId: number) => {
  cartStore.updateItemQuantity(productId, -1);
};

const removeItem = (productId: number) => {
  cartStore.removeItem(productId);
};
</script>

<style lang="scss" scoped>
.cart-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;

  h2 {
    font-size: 1.2rem;
    margin: 0;
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  flex: 1;

  p {
    margin: 16px 0;
    color: #666;
  }
}

.cart-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.cart-item {
  display: flex;
  margin-bottom: 16px;

  .item-image {
    margin-right: 12px;
  }

  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;

    .item-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .item-price {
      color: #f44336;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .item-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .quantity-control {
        display: flex;
        align-items: center;

        .quantity {
          margin: 0 8px;
          min-width: 20px;
          text-align: center;
        }
      }
    }
  }
}

.cart-summary {
  padding: 16px;

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    &.total {
      font-weight: bold;
      font-size: 1.1rem;
      margin-top: 12px;
    }
  }
}

.cart-actions {
  padding: 0 16px 16px;
}
</style>
