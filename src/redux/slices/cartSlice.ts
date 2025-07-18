// redux/slices/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { MenuItem } from "../../types"

export interface CartItem extends MenuItem {
  quantity: number
  // Add any other fields
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart: state => {
      state.items = []
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
