import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import categoryRouter from "./modules/category/category.router";


const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Better Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/categories", categoryRouter);
// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("MediStore API is running! 💊");
});

export default app;