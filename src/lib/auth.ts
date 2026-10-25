import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { verifyUserCredentials, findUserByEmail } from "./users";
import { Role } from "@/types/next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // 1. Credentials Provider (Email & Password)
    CredentialsProvider({
      id: "credentials",
      name: "Tài khoản mật khẩu",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu.");
        }

        const user = await verifyUserCredentials(credentials.email, credentials.password);
        if (!user) {
          throw new Error("Email hoặc mật khẩu không chính xác.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        };
      },
    }),

    // 2. OAuth Provider (GitHub)
    GithubProvider({
      clientId: process.env.GITHUB_ID || "demo_github_client_id",
      clientSecret: process.env.GITHUB_SECRET || "demo_github_client_secret",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Khi đăng nhập lần đầu
      if (user) {
        token.id = user.id;
        token.role = (user.role as Role) || "user";
      }

      // Xử lý khi đăng nhập qua OAuth (GitHub)
      if (account && account.provider === "github") {
        const existing = await findUserByEmail(token.email || "");
        if (existing) {
          token.id = existing.id;
          token.role = existing.role;
        } else {
          // Gán mặc định cho OAuth user mới
          const isOwnerAdmin = token.email === "admin@example.com";
          token.role = isOwnerAdmin ? "admin" : "user";
          token.id = `oauth_${account.provider}_${account.providerAccountId}`;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as Role) || "user";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_wnc_tuan_8_2026",
};
