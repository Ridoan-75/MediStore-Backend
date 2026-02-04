import { betterAuth, APIError } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_NAME,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.FRONTEND_URL!],
  
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        const resetUrl = `${process.env.FRONTEND_URL!}/reset-password?token=${token}`;

        await transporter.sendMail({
          from: `"MediStore" <${process.env.GMAIL_NAME}>`,
          to: user.email,
          subject: "Reset Your MediStore Password",
          html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💊 MediStore</h1>
        </div>

        <div style="padding: 40px 30px; color: #333333;">
            <h2 style="margin-top: 0; color: #111111;">Hello${user.name ? ", " + user.name : ""}!</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                We received a request to reset your password. Click the button below to reset it.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Reset Password
                </a>
            </div>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                Or copy this link: <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
            </p>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                This link expires in 1 hour. If you didn't request this, ignore this email.
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">© ${new Date().getFullYear()} MediStore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
          `,
        });
      } catch (error: any) {
        console.error("Reset password email failed:", error.message);
        throw error;
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      if (process.env.NODE_ENV === "seeding") return;
      
      try {
        const verificationUrl = `${process.env.FRONTEND_URL!}/verify-email?token=${token}`;

        await transporter.sendMail({
          from: `"MediStore" <${process.env.GMAIL_NAME}>`,
          to: user.email,
          subject: "Verify Your MediStore Account",
          html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💊 MediStore</h1>
        </div>

        <div style="padding: 40px 30px; color: #333333;">
            <h2 style="margin-top: 0; color: #111111;">Welcome${user.name ? ", " + user.name : ""}!</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                Thank you for signing up. Verify your email to start shopping.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Verify Email
                </a>
            </div>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                Or copy this link: <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">© ${new Date().getFullYear()} MediStore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
          `,
        });
      } catch (error: any) {
        console.error("Verification email failed:", error.message);
        throw error;
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
    },
  },

  hooks: {
    after: async (ctx: any) => {
      if (ctx.path === "/sign-in/email" || ctx.path.startsWith("/callback/")) {
        const session = ctx.context.newSession;
        if (session?.user && (session.user as any).isActive === false) {
          throw new APIError("FORBIDDEN", {
            message: "Your account is suspended. Contact admin.",
          });
        }
      }
      return ctx;
    },
  },
});