import Express from "express";
import { medicineController } from "./medicine.controller";
import { Role } from "../../../generated/prisma/enums";
import authGuard from "../../middleware/authGuard";


const medicineRouter = Express.Router();

medicineRouter.post(
  "/",
  authGuard(Role.SELLER, Role.ADMIN), 
  medicineController.createMedicine,
);

medicineRouter.get("/", medicineController.getAllMedicines);

medicineRouter.get(
  "/seller",
  authGuard(Role.SELLER),
  medicineController.getAllMedicinesBySellerId,
);

medicineRouter.get("/:id", medicineController.getMedicineById);

medicineRouter.put(
  "/:id",
  authGuard(Role.SELLER, Role.ADMIN),
  medicineController.updateMedicine,
);

medicineRouter.delete(
  "/:id",
  authGuard(Role.SELLER, Role.ADMIN), 
  medicineController.deleteMedicine,
);

export default medicineRouter;