import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { userControllers } from "./user-controllers";
const router = Router();

//POST:api/v1/users/sign-up -> user signup || public
router.post("/sign-up/email", userControllers.signup);

//GET:api/v1/users/me -> get current user info || customer, seller & admin
router.get("/me", proxy("user", "read"), userControllers.me);

//GET:api/v1/users/ -> get all users || admin only
router.get("/", proxy("user", "read"), userControllers.getAllUsers);

//GET:api/v1/users/:userId -> get user by id || admin only
router.get("/:userId", proxy("user", "read"), userControllers.getUserById);

//PUT:api/v1/users/:userId -> update user by id || admin & customer & seller
router.put("/:userId", proxy("user", "update"), userControllers.updateUserById);

//DELETE:api/v1/users/:userId -> delete user by id || admin only
router.delete(
  "/:userId",
  proxy("user", "delete"),
  userControllers.deleteUserById,
);

export const userRoutes = router;
