import createError from "http-errors";
import { Role } from "../../generated/prisma/client";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Admin User",
      email: "admin@medistore.com",
      password: "Admin@1234",
    };

    // check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      const error = createError(400, "Admin user already exists");
      throw error;
    }

    // create admin user
    const { user } = await auth.api.signUpEmail({
      body: {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
      },
    });

    if (!user) {
      throw createError(500, "Failed to create admin user");
    }

    // update emailVerified to true and role to ADMIN
    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true, role: Role.ADMIN },
    });

    console.log("Admin user created and email verified.");
  } catch (error: unknown) {
    console.error("Error seeding admin user:", error);
  }
};

seedAdmin();
