import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (e) {
    console.error("Could not load cart from local storage", e);
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
  } catch (e) {
    console.error("Could not save cart to local storage", e);
  }
};

const initialState = {
  items: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, colorOptionId, selectedSize } = action.payload;

      const itemIndex = state.items.findIndex(item =>
        item.id === id &&
        item.colorOptionId === colorOptionId &&
        item.selectedSize === selectedSize
      );

      if (itemIndex >= 0) {
        // Item exists, update quantity
        state.items[itemIndex].quantity += action.payload.quantity;
        toast.success("Item quantity updated in cart!", { autoClose: 500 });
      } else {
        // Item does not exist, add to cart
        state.items.push({ ...action.payload, quantity: action.payload.quantity });
        toast.success("Item added to cart!", { autoClose: 500 });
      }

      saveCartToLocalStorage(state.items);
    },

    deleteFromCart: (state, action) => {
      const { id, colorOptionId, selectedSize } = action.payload;

      state.items = state.items.filter(item =>
        !(item.id === id &&
          item.colorOptionId === colorOptionId &&
          item.selectedSize === selectedSize)
      );

      saveCartToLocalStorage(state.items);
      toast.error("Item removed from cart!", { autoClose: 500 });
    },

    resetCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
      toast.success("Cart reset!", { autoClose: 500 });
    },

    incrementQuantity: (state, action) => {
      const { id, colorOptionId, selectedSize } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.colorOptionId === colorOptionId &&
          item.selectedSize === selectedSize
      );
      if (item) {
        item.quantity += 1;
        saveCartToLocalStorage(state.items);
      }
    },

    decrementQuantity: (state, action) => {
      const { id, colorOptionId, selectedSize } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.colorOptionId === colorOptionId &&
          item.selectedSize === selectedSize
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToLocalStorage(state.items);
      }
    },
    updateQuantity: (state, action) => {
  const { id, colorOptionId, quantity } = action.payload;
  const existingItem = state.items.find(
    (item) =>
      item._id === id && item.selectedOption._id === colorOptionId
  );
  if (existingItem) {
    existingItem.quantity = quantity;
  }
},
  },
});

export const { addToCart, deleteFromCart, resetCart, incrementQuantity, decrementQuantity,updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
