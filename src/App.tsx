import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchProducts } from './features/products/productsSlice'
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from './features/cart/cartSlice'
import './App.css'

function ProductList() {
  const dispatch = useAppDispatch()
  const { products, status, error } = useAppSelector((state) => state.products)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  if (status === 'loading') {
    return <p>Đang tải danh sách sản phẩm...</p>
  }

  if (status === 'failed') {
    return <p className="error">Lỗi: {error}</p>
  }

  return (
    <section className="product-panel">
      <h2>Sản phẩm</h2>
      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-header">
              <span className="category">{product.category}</span>
              <span className="stock">Còn {product.stock}</span>
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-footer">
              <strong>{product.price.toLocaleString('vi-VN')}₫</strong>
              <button type="button" onClick={() => dispatch(addToCart(product))}>
                Thêm vào giỏ
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Cart() {
  const dispatch = useAppDispatch()
  const { items, totalQuantity, totalAmount } = useAppSelector((state) => state.cart)

  return (
    <aside className="cart-panel">
      <h2>Giỏ hàng</h2>

      {items.length === 0 ? (
        <p className="empty-cart">Giỏ hàng trống</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <div>
                <h4>{item.name}</h4>
                <p>{item.price.toLocaleString('vi-VN')}₫ / sản phẩm</p>
              </div>

              <div className="cart-controls">
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      updateQuantity({ productId: item.id, quantity: item.quantity - 1 }),
                    )
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      updateQuantity({ productId: item.id, quantity: item.quantity + 1 }),
                    )
                  }
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="remove-btn"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-summary">
        <p>
          Số lượng: <strong>{totalQuantity}</strong>
        </p>
        <p>
          Tổng tiền: <strong>{totalAmount.toLocaleString('vi-VN')}₫</strong>
        </p>
        <button type="button" className="clear-btn" onClick={() => dispatch(clearCart())}>
          Xóa giỏ hàng
        </button>
      </div>
    </aside>
  )
}

function AppContent() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Redux Toolkit Store</h1>
      </header>
      <main className="store-layout">
        <ProductList />
        <Cart />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
