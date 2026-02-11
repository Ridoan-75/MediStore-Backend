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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server health check
app.get("/", (_req, res) => {
  res.status(200).send("Server is running...");
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/category", categoryRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);

export default app;
