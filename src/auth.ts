// src/auth.ts

import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { getUserModel } from "@/models/userModel"
import GitHub from "next-auth/providers/github"

export const { 
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({  // Add this GitHub provider
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        if (!email || !password) {
          throw new Error("Missing username or password")
        }

        const User = await getUserModel()
        const user = await User.findOne({ email }).select("+password")

        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        const isPasswordCorrect = await compare(password, user.password)

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password")
        }

        return { id: user._id.toString(), name: user.name, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT callback', { token, user, account });
      if (user) {
        token.id = user.id
      }
      if (account?.provider === "google" || account?.provider === "github") {
        const User = await getUserModel()
        const existingUser = await User.findOne({ email: token.email })
        if (!existingUser) {
          const newUser = await User.create({
            email: token.email,
            name: token.name,
            image: token.picture,
            googleId: account.provider === "google" ? token.sub : undefined,
            githubId: account.provider === "github" ? token.sub : undefined,
          })
          token.id = newUser._id.toString()
        } else {
          token.id = existingUser._id.toString()
        }
      }
      console.log("JWT set:", token);
      return token
    },
    async session({ session, token }) {
      console.log('Session callback', { session, token });
      if (session.user) {
        session.user.id = token.id as string
      }
      console.log("Session set:", session); // Add this line
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback', { url, baseUrl });
      // After successful login, always redirect to dashboard
      if (url.startsWith(`${baseUrl}/login`) || url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      // If they try to visit a protected page and are not logged in, 
      // this will be handled by the authorized callback
      return url;
    },
  },})
  // cookies: {
  //   sessionToken: {
  //     name: "authjs.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   callbackUrl: {
  //     name: `authjs.callback-url`,
  //     options: {
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   csrfToken: {
  //     name: `authjs.csrf-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
// })