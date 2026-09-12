import React from 'react';
import { Accordion } from './components/Accordion';
import { usePagination } from './hooks/usePagination';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const mockProducts: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  price: (i + 1) * 100,
  category: i % 2 === 0 ? 'Điện thoại' : 'Laptop',
}));

export const ProductListingPage = () => {
  // Áp dụng custom hook phân trang với 6 sản phẩm / trang
  const {
    currentPage,
    totalPages,
    currentData: products,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination<Product>({
    data: mockProducts,
    itemsPerPage: 6,
  });

  return (
    <div style={{ display: 'flex', gap: '24px', padding: '20px' }}>
      {/* 1. Accordion cho phần FAQ / Bộ lọc */}
      <aside style={{ width: '300px' }}>
        <h3>Thông tin & Trợ giúp</h3>
        <Accordion defaultActiveId="item-1">
          <Accordion.Item id="item-1">
            <Accordion.Header>Chính sách giao hàng</Accordion.Header>
            <Accordion.Panel>Giao hàng miễn phí cho đơn từ 500k.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="item-2">
            <Accordion.Header>Chính sách đổi trả</Accordion.Header>
            <Accordion.Panel>Hỗ trợ đổi trả trong vòng 7 ngày.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="item-3">
            <Accordion.Header>Bảo hành sản phẩm</Accordion.Header>
            <Accordion.Panel>Bảo hành 12 tháng chính hãng.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </aside>

      {/* 2. Danh sách sản phẩm kết hợp Phân trang */}
      <main style={{ flex: 1 }}>
        <h2>Danh sách sản phẩm (Trang {currentPage}/{totalPages})</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '16px' }}>
              <h4>{product.name}</h4>
              <p>Giá: {product.price}.000đ</p>
              <small>Danh mục: {product.category}</small>
            </div>
          ))}
        </div>

        {/* Nút điều hướng phân trang */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={prevPage} disabled={!hasPrevPage}>
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
            >
              {page}
            </button>
          ))}

          <button onClick={nextPage} disabled={!hasNextPage}>
            Sau
          </button>
        </div>
      </main>
    </div>
  );
};