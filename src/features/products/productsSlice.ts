import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  stock: number
}

interface ProductsState {
  products: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null,
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Gaming 15"',
    price: 18990000,
    description: 'Laptop mạnh mẽ cho game và đồ họa.',
    category: 'Laptops',
    stock: 8,
  },
  {
    id: 2,
    name: 'Tai nghe Bluetooth X10',
    price: 2490000,
    description: 'Âm thanh rõ nét và pin bền bỉ.',
    category: 'Audio',
    stock: 14,
  },
  {
    id: 3,
    name: 'Bàn phím cơ RGB',
    price: 1690000,
    description: 'Phím cơ 75% với switch cơ bản và ánh sáng RGB.',
    category: 'Accessories',
    stock: 21,
  },
  {
    id: 4,
    name: 'Màn hình 27" 2K',
    price: 8990000,
    description: 'Hiển thị sắc nét cho công việc và giải trí.',
    category: 'Monitors',
    stock: 6,
  },
]

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockProducts
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Không thể tải danh sách sản phẩm.'
      })
  },
})

export default productsSlice.reducer
