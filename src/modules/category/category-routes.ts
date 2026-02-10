import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { categoryControllers } from "./category-controllers";

const router = Router();

//POST:api/v1/category -> create a new category || Admin Only
router.post(
  "/",
  proxy("category", "create"),
  categoryControllers.createCategory,
);

//GET:api/v1/category/:slug -> get category by slug || Public
router.get("/:slug", categoryControllers.getCategoryBySlug);

//GET:api/v1/category/id/:id -> get category by id || Public
router.get("/id/:id", categoryControllers.getCategoryById);

// PUT:api/v1/category/:id -> update category by id || Admin Only
router.put(
  "/:id",
  proxy("category", "update"),
  categoryControllers.updateCategoryById,
);
// DELETE:api/v1/category/:id -> delete || Admin Only
router.delete(
  "/:id",
  proxy("category", "delete"),
  categoryControllers.deleteCategoryById,
);

// GET:api/v1/category -> get all categories || Public
router.get("/", categoryControllers.getAllCategories);

export const categoryRoutes = router;
