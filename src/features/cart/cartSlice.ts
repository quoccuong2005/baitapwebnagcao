import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../products/productsSlice'

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
}

const roundMoney = (value: number) => Number(value.toFixed(2))

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload
      const existingItem = state.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }

      state.totalQuantity += 1
      state.totalAmount = roundMoney(state.totalAmount + product.price)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const itemToRemove = state.items.find((item) => item.id === action.payload)

      if (!itemToRemove) {
        return
      }

      state.totalQuantity -= itemToRemove.quantity
      state.totalAmount = roundMoney(
        state.totalAmount - itemToRemove.price * itemToRemove.quantity,
      )
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload
      const existingItem = state.items.find((item) => item.id === productId)

      if (!existingItem) {
        return
      }

      const delta = quantity - existingItem.quantity

      if (quantity <= 0) {
        state.totalQuantity -= existingItem.quantity
        state.totalAmount = roundMoney(
          state.totalAmount - existingItem.price * existingItem.quantity,
        )
        state.items = state.items.filter((item) => item.id !== productId)
        return
      }

      existingItem.quantity = quantity
      state.totalQuantity += delta
      state.totalAmount = roundMoney(state.totalAmount + existingItem.price * delta)
    },
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalAmount = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
