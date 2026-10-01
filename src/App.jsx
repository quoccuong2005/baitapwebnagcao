import { memo, useDeferredValue, useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  ArrowDownUp, Bell, Boxes, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Download, Ellipsis, LayoutDashboard, Package, Plus, Search,
  Settings2, SlidersHorizontal, Sparkles, Users,
} from 'lucide-react'
import './App.css'

const categories = ['Furniture', 'Lighting', 'Tableware', 'Textiles', 'Decor']
const statuses = ['In stock', 'Low stock', 'Out of stock']
const colors = ['sage', 'clay', 'ink', 'ochre', 'sky']
const products = Array.from({ length: 10_000 }, (_, index) => {
  const number = index + 1
  return {
    id: `PR-${String(number).padStart(5, '0')}`,
    name: `${['Arc', 'Form', 'Field', 'Morrow', 'Atelier'][index % 5]} ${['Pendant', 'Vase', 'Lounge Chair', 'Side Table', 'Woven Throw'][Math.floor(index / 5) % 5]}`,
    category: categories[index % categories.length],
    stock: (number * 17) % 126,
    price: 28 + ((number * 137) % 972),
    status: statuses[number % 17 === 0 ? 2 : number % 7 === 0 ? 1 : 0],
    color: colors[index % colors.length],
    initials: ['AP', 'FV', 'FC', 'MS', 'AW'][index % 5],
  }
})
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const ProductRow = memo(function ProductRow({ product, start, size }) {
  return (
    <tr style={{ height: `${size}px`, transform: `translateY(${start}px)` }}>
      <td><input aria-label={`Select ${product.name}`} type="checkbox" /></td>
      <td><div className="product-cell"><span className={`product-thumb ${product.color}`}>{product.initials}</span><span className="product-name">{product.name}</span></div></td>
      <td><span className="sku">{product.id}</span></td>
      <td>{product.category}</td>
      <td>{product.stock} units</td>
      <td><span className={`status status-${product.status.toLowerCase().replaceAll(' ', '-')}`}><i />{product.status}</span></td>
      <td className="price">{currency.format(product.price)}</td>
      <td><button className="icon-button row-more" aria-label={`More actions for ${product.name}`}><Ellipsis size={17} /></button></td>
    </tr>
  )
})

function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All products')
  const [sortAscending, setSortAscending] = useState(true)
  const [selectedCount, setSelectedCount] = useState(0)
  const deferredQuery = useDeferredValue(query)
  const scrollContainerRef = useRef(null)
  const visibleProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.toLowerCase()
    return products
      .filter((product) => {
        const matchesQuery = `${product.name} ${product.id} ${product.category}`.toLowerCase().includes(normalizedQuery)
        return matchesQuery && (activeFilter === 'All products' || product.status === activeFilter)
      })
      .sort((first, second) => sortAscending ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name))
  }, [activeFilter, deferredQuery, sortAscending])
  const rowVirtualizer = useVirtualizer({
    count: visibleProducts.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 47,
    overscan: 8,
  })

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#catalog" aria-label="Northstar home"><span className="brand-mark"><span /></span><span>northstar<span className="brand-period">.</span></span></a>
        <div className="workspace-switcher"><span className="workspace-avatar">N</span><span className="workspace-label"><strong>Northstar Studio</strong><small>Workspace</small></span><ChevronDown size={15} /></div>
        <div className="side-label">Workspace</div>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#overview"><LayoutDashboard size={17} />Overview</a><a className="nav-active" href="#catalog"><Package size={17} />Catalog<span className="nav-count">10k</span></a><a href="#inventory"><Boxes size={17} />Inventory</a><a href="#customers"><Users size={17} />Customers</a>
        </nav>
        <div className="sidebar-bottom"><a href="#help"><CircleHelp size={17} />Help center</a><a href="#settings"><Settings2 size={17} />Settings</a><div className="profile"><span className="profile-avatar">MC</span><span className="profile-label"><strong>Mai Chen</strong><small>Store owner</small></span><Ellipsis size={18} /></div></div>
      </aside>
      <main className="main-content" id="catalog">
        <header className="topbar"><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>Catalog</strong></div><div className="topbar-actions"><span className="sync-status"><i />All changes saved</span><button className="icon-button" aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button></div></header>
        <section className="page-heading"><div><div className="eyebrow"><Sparkles size={13} />PRODUCT MANAGEMENT</div><h1>Catalog</h1><p>Manage your products, variants, and availability.</p></div><div className="heading-actions"><button className="button button-secondary"><Download size={16} />Export</button><button className="button button-primary"><Plus size={17} />Add product</button></div></section>
        <section className="overview-strip" aria-label="Catalog summary">
          <div className="overview-stat"><span className="stat-label">Total products</span><strong>10,000</strong><span className="stat-change"><b>+4.8%</b> vs last month</span></div>
          <div className="overview-stat"><span className="stat-label">Inventory value</span><strong>$284,390</strong><span className="stat-change"><b>+2.1%</b> vs last month</span></div>
          <div className="overview-stat"><span className="stat-label">Low stock</span><strong>1,428</strong><span className="stat-note">Across 5 categories</span></div>
          <div className="overview-stat"><span className="stat-label">Out of stock</span><strong>588</strong><span className="stat-note">Needs attention</span></div>
          <div className="stock-chart" aria-hidden="true"><span>STOCK HEALTH</span><div>{[34, 48, 40, 68, 56, 78, 61, 91, 74, 84, 62, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><small>Last 12 weeks <b>↗ 12%</b></small></div>
        </section>
        <section className="catalog-panel" aria-label="Product catalog">
          <div className="panel-heading"><div><h2>All products <span>{visibleProducts.length.toLocaleString()}</span></h2><p>A complete list of products in your store.</p></div><button className="icon-button filter-button" aria-label="More filters"><SlidersHorizontal size={17} /></button></div>
          <div className="table-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter products">
            {['All products', 'In stock', 'Low stock', 'Out of stock'].map((filter) => <button key={filter} role="tab" aria-selected={activeFilter === filter} className={activeFilter === filter ? 'tab-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}{filter === 'Low stock' && <span className="tab-dot" />}</button>)}
          </div><label className="search-field"><Search size={16} /><input aria-label="Search products" placeholder="Search products..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label></div>
          <div className="table-scroll" ref={scrollContainerRef}><table><thead><tr><th><input aria-label="Select all products" type="checkbox" onChange={(event) => setSelectedCount(event.target.checked ? visibleProducts.length : 0)} /></th><th>Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Status</th><th><button className="sort-button" onClick={() => setSortAscending(!sortAscending)}>Price <ArrowDownUp size={13} /></button></th><th><span className="sr-only">Actions</span></th></tr></thead><tbody style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>{rowVirtualizer.getVirtualItems().map((virtualRow) => <ProductRow key={visibleProducts[virtualRow.index].id} product={visibleProducts[virtualRow.index]} start={virtualRow.start} size={virtualRow.size} />)}</tbody></table></div>
          <div className="table-footer"><span>{selectedCount ? `${selectedCount.toLocaleString()} selected` : `Showing ${visibleProducts.length.toLocaleString()} products`}</span><div className="page-controls"><span>Rows per page <strong>10,000</strong></span><button className="icon-button" aria-label="Previous page" disabled><ChevronLeft size={16} /></button><button className="icon-button" aria-label="Next page" disabled><ChevronRight size={16} /></button></div></div>
        </section>
        <footer className="page-footer"><span>Northstar Commerce</span><span>Catalog data updated just now</span></footer>
      </main>
    </div>
  )
}
export default App
