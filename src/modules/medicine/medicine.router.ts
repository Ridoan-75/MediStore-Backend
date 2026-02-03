import Express from "express";
import { medicineController } from "./medicine.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";


const medicineRouter = Express.Router();

medicineRouter.post(
  "/",
  authGuard(Role.SELLER, Role.ADMIN), // ✅ Changed
  medicineController.createMedicine,
);

medicineRouter.get("/", medicineController.getAllMedicines);

medicineRouter.get(
  "/seller",
  authGuard(Role.SELLER), // ✅ Changed
  medicineController.getAllMedicinesBySellerId,
);

medicineRouter.get("/:id", medicineController.getMedicineById);

medicineRouter.put(
  "/:id",
  authGuard(Role.SELLER, Role.ADMIN), // ✅ Changed
  medicineController.updateMedicine,
);

medicineRouter.delete(
  "/:id",
  authGuard(Role.SELLER, Role.ADMIN), // ✅ Changed
  medicineController.deleteMedicine,
);

export default medicineRouter;