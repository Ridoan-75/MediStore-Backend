import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
  },

  trustedOrigins: [
    "http://localhost:3000",
    process.env.FRONTEND_URL!,
    "https://698ec87a383f880008b269ac--medistore-client.netlify.app",
  ],

  user: {
    additionalFields: {
      role: { type: "string", required: false },
      phone: { type: "string", required: false },
      address: { type: "string", required: false },
      status: { type: "string", defaultValue: "ACTIVE", required: false },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});