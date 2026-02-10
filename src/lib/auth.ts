import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { Role } from "../../generated/prisma/enums";
import {
  BETTER_AUTH_URL,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../config/env";
import { adminRole, customerRole, sellerRole } from "../config/permission";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: [
    BETTER_AUTH_URL as string,
    FRONTEND_URL as string,
    "http://localhost:3000",
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
      dob: {
        type: "date",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      address: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  plugins: [
    admin({
      adminRoles: [Role.CUSTOMER, Role.SELLER, Role.ADMIN],
      defaultRole: "user",
      roles: {
        [Role.ADMIN]: adminRole,
        [Role.SELLER]: sellerRole,
        [Role.CUSTOMER]: customerRole,
      },
    }),
  ],
});
