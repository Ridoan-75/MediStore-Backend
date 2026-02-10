import app from "./app";
import { PORT } from "./config/env";
import { prisma } from "./lib/prisma";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
