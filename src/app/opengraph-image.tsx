import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hệ thống Phân quyền NextAuth & Tối ưu SEO";
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)",
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
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(to right, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            🛡️
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#a5b4fc",
            }}
          >
            Web Nâng Cao - Bài Tập Tuần 8
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              background: "linear-gradient(to right, #ffffff, #e2e8f0)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Bảo Mật NextAuth RBAC
            <br />
            &amp; Tối Ưu Hóa SEO Chuẩn Google
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
            Phân quyền 3 tầng: Middleware • Server Component • Server Action.
            Đầy đủ Canonical, JSON-LD và OpenGraph Image chuẩn SEO.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "20px",
            color: "#64748b",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "8px 18px",
              borderRadius: "9999px",
              color: "#c7d2fe",
            }}
          >
            ✓ NextAuth.js v4
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "8px 18px",
              borderRadius: "9999px",
              color: "#c7d2fe",
            }}
          >
            ✓ OAuth &amp; Credentials
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "8px 18px",
              borderRadius: "9999px",
              color: "#c7d2fe",
            }}
          >
            ✓ 100/100 Lighthouse
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
