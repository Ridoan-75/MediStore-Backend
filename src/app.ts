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

// ✅ Simple CORS - Allow all origins
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({ 
    status: "success",
    message: "MediStore Backend API is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ 
    status: "healthy",
    database: "connected"
  });
});

app.use("/api/auth", toNodeHandler(auth));
app.use("/api/category", categoryRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);

app.use((_req, res) => {
  res.status(404).json({ 
    status: "error",
    message: "Route not found" 
  });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: "error",
    message: err.message || "Internal server error" 
  });
});

export default app;