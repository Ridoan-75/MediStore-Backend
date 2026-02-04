import Express from "express";
import { categoryController } from "./category.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";


const categoryRouter = Express.Router();

categoryRouter.post(
  "/",
  authGuard(Role.ADMIN), 
  categoryController.createCategory,
);

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:categoryId", categoryController.getCategoryById);

categoryRouter.put(
  "/:categoryId",
  authGuard(Role.ADMIN),
  categoryController.updateCategory,
);

categoryRouter.delete(
  "/:categoryId",
  authGuard(Role.ADMIN),
  categoryController.deleteCategory,
);

export default categoryRouter;