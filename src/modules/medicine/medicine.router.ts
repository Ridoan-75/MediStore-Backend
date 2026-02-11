import Express from "express";
import { medicineController } from "./medicine.controller";
import authGuard, { UserRole } from "../../middlewares/authGuard";

const medicineRouter = Express.Router();

medicineRouter.post(
  "/",
  authGuard(UserRole.SELLER, UserRole.ADMIN),
  medicineController.createMedicine,
);

medicineRouter.get("/", medicineController.getAllMedicines);

medicineRouter.get(
  "/seller",
  authGuard(UserRole.SELLER),
  medicineController.getAllMedicinesBySellerId,
);
medicineRouter.get("/:id", medicineController.getMedicineById);

medicineRouter.delete(
  "/:id",
  authGuard(UserRole.SELLER, UserRole.ADMIN),
  medicineController.deleteMedicine,
);

medicineRouter.put(
  "/:id",
  authGuard(UserRole.SELLER, UserRole.ADMIN),
  medicineController.updateMedicine,
);

export default medicineRouter;
