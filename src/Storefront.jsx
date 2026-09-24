import { useState } from 'react'
import { useFavoritesStore } from './stores/favoritesStore'
import './Storefront.css'

const products = [
  { id: 1, name: 'Linen Form Shirt', category: 'Áo sơ mi', price: '680.000đ', color: 'Ivory', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85' },
  { id: 2, name: 'Daily Canvas Tote', category: 'Túi xách', price: '420.000đ', color: 'Sand', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85' },
  { id: 3, name: 'Sculptural Ceramic', category: 'Đồ trang trí', price: '890.000đ', color: 'Clay', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=85' },
  { id: 4, name: 'Soft Knit Cardigan', category: 'Áo len', price: '1.240.000đ', color: 'Oat', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=85' },
  { id: 5, name: 'Arc Table Lamp', category: 'Ánh sáng', price: '1.580.000đ', color: 'Moss', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85' },
  { id: 6, name: 'Weekend Loafer', category: 'Giày', price: '1.090.000đ', color: 'Chestnut', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=85' },
]

export default function Storefront() {
  const [activeFilter, setActiveFilter] = useState('all')
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const visibleProducts = activeFilter === 'all' ? products : products.filter((product) => favoriteIds.includes(product.id))

  return <main className="storefront">
    <header className="topbar"><a className="brand" href="#top">MỘC / FORM</a><nav aria-label="Điều hướng chính"><a href="#collection">Bộ sưu tập</a><a href="#about">Về chúng tôi</a></nav><div className="header-tools"><button className="bag-button" type="button">Giỏ hàng <span>0</span></button><button className="menu-button" type="button" aria-label="Mở menu">☰</button></div></header>
    <section className="intro" id="top"><p className="eyebrow">CURATED OBJECTS / 2024</p><h1>Những món đồ<br /><em>ở lại thật lâu.</em></h1><p className="intro-copy">Một tuyển chọn nhỏ của những sản phẩm được làm ra để đi cùng nhịp sống chậm, đẹp và có chủ đích.</p></section>
    <section className="collection" id="collection"><div className="section-heading"><div><p className="eyebrow">01 — THE EDIT</p><h2>Chọn theo cảm hứng</h2></div><div className="filters" role="group" aria-label="Lọc sản phẩm"><button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')} type="button">Tất cả <small>{products.length}</small></button><button className={activeFilter === 'favorites' ? 'active' : ''} onClick={() => setActiveFilter('favorites')} type="button">Yêu thích <small>{favoriteIds.length}</small></button></div></div>{visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => { const isFavorite = favoriteIds.includes(product.id); return <article className="product-card" key={product.id}><div className="product-image-wrap"><img src={product.image} alt={product.name} className="product-image" /><button className={`favorite-button ${isFavorite ? 'selected' : ''}`} type="button" onClick={() => toggleFavorite(product.id)} aria-label={isFavorite ? `Bỏ ${product.name} khỏi yêu thích` : `Thêm ${product.name} vào yêu thích`} aria-pressed={isFavorite}>{isFavorite ? '♥' : '♡'}</button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.category} · {product.color}</p></div><strong>{product.price}</strong></div></article> })}</div> : <div className="empty-state"><span>♡</span><p>Chưa có sản phẩm yêu thích.</p><button type="button" onClick={() => setActiveFilter('all')}>Khám phá sản phẩm</button></div>}</section>
    <footer id="about"><p>MỘC / FORM</p><span>Đồ vật tử tế cho những ngày bình thường.</span><small>© 2024 — Made with intention</small></footer>
  </main>
}