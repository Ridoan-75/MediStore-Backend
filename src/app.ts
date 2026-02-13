import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import categoryRouter from "./modules/category/category.router";
import medicineRouter from "./modules/medicine/medicine.router";
import orderRouter from "./modules/order/order.router";
import userRouter from "./modules/user/user.router";
import reviewRouter from "./modules/review/review.router";

const app = express();

// ✅ Trust proxy (Render.com এর জন্য)
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL || "https://medistore-client-lime.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ✅
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // ✅
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server health check
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "MediStore Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    database: "connected",
  });
});

// ✅ Better Auth (improved)
app.use("/api/auth", toNodeHandler(auth));

app.use("/api/category", categoryRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: err.message || "Internal server error",
    });
  },
);

export default app;