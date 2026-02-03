import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import categoryRouter from "./modules/category/category.router";
import medicineRouter from "./modules/medicine/medicine.router"; // ✅ Import

const app = express();

app.use(cors());
app.use(express.json());

app.all("/api/auth/*", toNodeHandler(auth));

app.use("/api/categories", categoryRouter);
app.use("/api/medicines", medicineRouter); // ✅ Add this

app.get("/", (req: Request, res: Response) => {
  res.send("MediStore API is running! 💊");
});

export default app;