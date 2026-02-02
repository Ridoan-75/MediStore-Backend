import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { getVerificationEmailHtml } from './mailTemplate';
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
      },
      phone: {
        type: "string",
        defaultValue: "",
      },
      address: {
        type: "string",
        defaultValue: "",
      },
    },
  },
  trustedOrigins: [process.env.APP_URL!, process.env.API_URL!].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        await transporter.sendMail({
          from: `"${process.env.APP_NAME || "Medi-Store"}" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Please verify your email!",
          html: getVerificationEmailHtml(verificationUrl, user.email),
        });
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
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