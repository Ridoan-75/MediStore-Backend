import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Medicine } from "../../../generated/prisma/client";
import { filter } from "../../helpers/filter";
import { getSlug } from "../../helpers/get-slug";
import { paginationSort } from "../../helpers/pagination-sort";
import { sendJSON } from "./../../helpers/send-json";
import { medicineServices } from "./medicine-services";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: Medicine = req.body;
    payload.slug = getSlug(payload.name);

    // check user is exists in request
    if (!req.user) {
      return sendJSON(false, res, 401, "Unauthorized");
    }

    payload.sellerId = req.user.id;

    // allow only otc only medicines for sellers
    if (payload.isOTCOnly !== true) {
      throw createError(403, "Sellers can only create OTC medicines");
    }

    const data = await medicineServices.createMedicine(payload);
    return sendJSON(true, res, 201, "Medicine created successfully", data);
  } catch (error) {
    next(error);
  }
};

const updateMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineId = req.params.id;
    if (!medicineId) {
      throw createError(400, "Medicine ID is required");
    }

    if (typeof medicineId !== "string") {
      throw createError(400, "Medicine ID must be a string");
    }

    const payload: Partial<Medicine> = req.body;

    // if name is being updated, update the slug as well
    if (payload.name) {
      payload.slug = getSlug(payload.name);
    }

    // prevent updating sellerId via this route
    if (payload.sellerId) {
      delete payload.sellerId;
    }

    const data = await medicineServices.updateMedicineById(medicineId, payload);
    return sendJSON(true, res, 200, "Medicine updated successfully", data);
  } catch (error) {
    next(error);
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineId = req.params.id;
    if (!medicineId) {
      throw createError(400, "Medicine ID is required");
    }
    if (typeof medicineId !== "string") {
      throw createError(400, "Medicine ID must be a string");
    }
    const data = await medicineServices.getMedicineById(medicineId);
    return sendJSON(true, res, 200, "Medicine fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchTerm, status, categoryId, id } = filter(req.query);
    const { page, limit, skip, sortBy, sortOrder } = paginationSort(req.query);

    const { data, pagination } = await medicineServices.getAllMedicines({
      searchTerm,
      status,
      categoryId,
      id,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    sendJSON(
      true,
      res,
      200,
      "Medicines fetched successfully",
      data,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

const deleteMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineId = req.params.id;
    if (!medicineId) {
      throw createError(400, "Medicine ID is required");
    }
    if (typeof medicineId !== "string") {
      throw createError(400, "Medicine ID must be a string");
    }
    await medicineServices.deleteMedicineById(medicineId);
    return sendJSON(true, res, 200, "Medicine deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getMedicineBySellerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      throw createError(400, "Seller ID is required");
    }
    if (typeof sellerId !== "string") {
      throw createError(400, "Seller ID must be a string");
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationSort(req.query);
    const { data, pagination } = await medicineServices.getMedicineBySellerId(
      sellerId,
      {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
      },
    );
    return sendJSON(
      true,
      res,
      200,
      "Medicines fetched successfully",
      data,
      pagination,
    );
  } catch (error) {
    next(error);
  }
};

export const medicineControllers = {
  createMedicine,
  updateMedicineById,
  getMedicineById,
  getAllMedicines,
  deleteMedicineById,
  getMedicineBySellerId,
};
