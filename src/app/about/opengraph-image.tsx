import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Giới thiệu Kiến trúc Bảo mật & SEO - Tuần 8";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #090d16 0%, #111827 50%, #1e1b4b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              background: "#3b82f6",
              fontSize: "18px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            TÀI LIỆU KỸ THUẬT
          </div>
          <span style={{ fontSize: "22px", color: "#9ca3af" }}>
            Báo cáo &amp; Phân tích Hệ thống
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
            }}
          >
            Kiến Trúc Bảo Mật Đa Tầng
            <br />
            &amp; Phân Quyền NextAuth RBAC
          </div>
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              maxWidth: "850px",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Chi tiết sơ đồ 3 lớp bảo vệ: Edge Middleware, Page Authorization, Server Action Protection.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          <span>Bài tập môn Web Nâng Cao</span>
          <span>•</span>
          <span>Next.js 14 App Router</span>
          <span>•</span>
          <span>JSON-LD &amp; OpenGraph Standard</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
