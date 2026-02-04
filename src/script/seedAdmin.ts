
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: Role.ADMIN,
      password: process.env.ADMIN_PASS,
    };

    if (!adminData.name || !adminData.email || !adminData.password) {
      throw new Error(
        "Missing required environment variables (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASS)"
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      console.log("Admin user already exists!");
      return;
    }

    const signUpAdmin = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.FRONTEND_URL as string,
        },
        body: JSON.stringify(adminData),
      }
    );

    const responseData = await signUpAdmin.json();

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
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
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();