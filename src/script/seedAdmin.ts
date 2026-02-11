import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: UserRole.ADMIN,
      password: process.env.ADMIN_PASSWORD,
    };

    if (
      !adminData.name ||
      !adminData.email ||
      !adminData.password ||
      !process.env.BACKEND_URL ||
      !process.env.FRONTEND_URL
    ) {
      throw new Error(
        "Missing required environment variables (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, BACKEND_URL, FRONTEND_URL)",
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!!");
    }

    const signUpAdmin = await fetch(
      `${process.env.BACKEND_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.FRONTEND_URL as string,
        },
        body: JSON.stringify(adminData),
      },
    );

    const responseData = await signUpAdmin.json();

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email as string,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("Admin user created successfully!");
    } else {
      throw new Error(`Sign-up failed: ${JSON.stringify(responseData)}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
