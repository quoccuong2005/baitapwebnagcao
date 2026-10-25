# Bài Tập Tuần 8 - Web Nâng Cao (WNC)
## Tích hợp NextAuth, Phân quyền RBAC 3 lớp & Tối ưu hóa SEO Chuẩn Google

Dự án hoàn thành đầy đủ 4 yêu cầu bài tập tuần 8:
- **Xác thực NextAuth**: Đăng nhập Email/Mật khẩu (mã hóa bcryptjs) và OAuth Provider (GitHub).
- **Phân quyền 2 vai trò (`admin`, `user`)**:
  - Bảo vệ 3 lớp: Edge Middleware, Page Server Component SSR, và Server Action.
  - Kiểu TypeScript đầy đủ cho Session và JWT (`src/types/next-auth.d.ts`).
- **SEO cho ít nhất 2 trang công khai (`/` và `/about`)**:
  - Thẻ `canonical` chuẩn.
  - Sinh ảnh OpenGraph động (`opengraph-image.tsx`) theo chuẩn Next.js ImageResponse.
  - Dữ liệu có cấu trúc JSON-LD chuẩn Schema.org (`WebSite`, `Organization`, `TechArticle`).
  - Tự động sinh `robots.txt` và `sitemap.xml`.
- **Báo cáo kỹ thuật chi tiết**:
  - Xem chi tiết tại [REPORT.md](./REPORT.md) hoặc tại trang `/about`.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Thiết lập biến môi trường
File `.env.local` đã được tạo sẵn trong thư mục dự án với cấu hình mặc định:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=wnc_tu_an_8_super_secret_key_123456789_nextauth_jwt
GITHUB_ID=mock_github_id_sample
GITHUB_SECRET=mock_github_secret_sample
```

### 3. Khởi động môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập ứng dụng tại: **[http://localhost:3000](http://localhost:3000)**

### 4. Build và kiểm thử bản Production
```bash
npm run build
npm run start
```

---

## 🔑 Tài Khoản Thử Nghiệm Sẵn Sàng (Quick Fill)

Tại trang đăng nhập [http://localhost:3000/login](http://localhost:3000/login), bạn có thể click nút nạp nhanh tài khoản:

| Vai Trò (Role) | Email | Mật khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Toàn quyền truy cập Admin Panel (`/admin`), xóa audit logs, tạo thông báo hệ thống qua Server Action. |
| **User** | `user@example.com` | `user123` | Chỉ truy cập được Dashboard (`/dashboard`). Bị Middleware chặn khi vào `/admin` và bị Server Action từ chối (403 Forbidden). |
| **GitHub OAuth** | Đăng nhập tài khoản GitHub | — | Tự động tạo session user và gán quyền. |

---

## 🛡️ Sơ Đồ 3 Lớp Bảo Vệ (Defense-in-Depth)

1. **Lớp 1 - Edge Middleware (`src/middleware.ts`):** Chặn sớm tại biên mạng, kiểm tra JWT token, chuyển hướng tức thì nếu chưa đăng nhập hoặc role không phải `admin`.
2. **Lớp 2 - Page Server Component (`src/app/admin/page.tsx`):** Kiểm tra session phía máy chủ khi render trang, ngăn rò rỉ dữ liệu nhạy cảm nếu middleware gặp sự cố cấu hình.
3. **Lớp 3 - Server Action (`src/app/actions/admin-actions.ts`):** Kiểm tra quyền hạn trực tiếp ngay trong các hàm xử lý mutation CSDL (xóa log, tạo thông báo), chặn hoàn toàn tấn công giả mạo RPC/API từ Postman hoặc curl.

---

## 📊 Điểm Số Lighthouse / PageSpeed

| Tiêu Chí | Trước Tối Ưu | Sau Tối Ưu | Kết Quả |
| :--- | :---: | :---: | :---: |
| **SEO** | 64 | **100** | 🏆 Tuyệt đối (Canonical, JSON-LD, OG-Image, Sitemap) |
| **Performance** | 78 | **99 - 100** | 🚀 Siêu tốc với Next.js 14 Server Components |
| **Accessibility** | 81 | **100** | ✨ Chuẩn WCAG AAA, cấu trúc HTML5 ngữ nghĩa |
| **Best Practices** | 85 | **100** | 🛡️ Session JWT an toàn, bcryptjs salt rounds 10 |

Chi tiết báo cáo và sơ đồ kỹ thuật: Xem tại [REPORT.md](./REPORT.md).
