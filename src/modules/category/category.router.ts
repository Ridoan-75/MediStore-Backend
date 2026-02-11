import Express from "express";
import { categoryController } from "./category.controller";
import authGuard, { UserRole } from "../../middlewares/authGuard";

const categoryRouter = Express.Router();

categoryRouter.post(
  "/",
  authGuard(UserRole.ADMIN),
  categoryController.createCategory,
);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:categoryId", categoryController.getCategoryById);
categoryRouter.put(
  "/:categoryId",
  authGuard(UserRole.ADMIN),
  categoryController.updateCategory,
);
categoryRouter.delete(
  "/:categoryId",
  authGuard(UserRole.ADMIN),
  categoryController.deleteCategory,
);

export default categoryRouter;
