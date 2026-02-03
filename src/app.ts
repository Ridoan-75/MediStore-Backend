import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import categoryRouter from "./modules/category/category.router";
import medicineRouter from "./modules/medicine/medicine.router"; // ✅ Import
import orderRouter from "./modules/order/order.router";
import reviewRouter from "./modules/review/review.router";
import userRouter from "./modules/user/user.router";



const app = express();

app.use(cors());
app.use(express.json());

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/reviews", reviewRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/medicines", medicineRouter); // ✅ Add this
app.use("/api/orders", orderRouter)
app.use("/api/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("MediStore API is running! 💊");
});

export default app;