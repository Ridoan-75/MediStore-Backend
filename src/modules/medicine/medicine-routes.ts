import { Router } from "express";
import { proxy } from "./../../middlewares/proxy";
import { medicineControllers } from "./medicine-controllers";

const router = Router();

//POST:api/v1/medicine/ -> create a new medicine || seller & admin
router.post(
  "/",
  proxy("medicine", "create"),
  medicineControllers.createMedicine,
);

//PUT:api/v1/medicine/:id -> update a medicine || seller & admin
router.put(
  "/:id",
  proxy("medicine", "update"),
  medicineControllers.updateMedicineById,
);

//GET:api/v1/medicine -> get all medicines || public
router.get("/", medicineControllers.getAllMedicines);

//GET:api/v1/medicine/:id -> get medicine by id || public
router.get("/:id", medicineControllers.getMedicineById);

//DELETE:api/v1/medicine/:id -> delete medicine by id || seller & admin
router.delete(
  "/:id",
  proxy("medicine", "delete"),
  medicineControllers.deleteMedicineById,
);

//GET:api/v1/medicine/seller/:sellerId -> get medicines by seller id || public
router.get("/seller/:sellerId", medicineControllers.getMedicineBySellerId);

export const medicineRoutes = router;
