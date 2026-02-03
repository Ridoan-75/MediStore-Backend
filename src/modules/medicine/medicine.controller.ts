import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
    };

    const result = await medicineService.createMedicine(payload, user.id);
    
    res.status(201).json({
      message: "Medicine created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    });
  }
};

const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const { search, minPrice, maxPrice, category } = req.query;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await medicineService.getAllMedicines({
      search: search as string | undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      category: category as string | undefined,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      message: "Medicines fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    });
  }
};

const getMedicineById = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    // Ensure id is always a string
    if (Array.isArray(id)) {
      id = id[0];
    }
    
    const medicine = await medicineService.getMedicineById(id);

    if (!medicine) {
      return res.status(404).json({ 
        message: "Medicine not found",
        data: null 
      });
    }

    res.status(200).json({
      message: "Medicine fetched successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure id is always a string
    if (Array.isArray(id)) {
      id = id[0];
    }

    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock, 10) : undefined,
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
    };

    const result = await medicineService.updateMedicine(payload, user.id, id);

    res.status(200).json({
      message: "Medicine updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await medicineService.deleteMedicine(id, user.id);

    res.status(200).json({
      message: "Medicine deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    });
  }
};

const getAllMedicinesBySellerId = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const medicines = await medicineService.getAllMedicinesBySellerId(user.id);

    res.status(200).json({
      message: "Medicines fetched successfully",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    });
  }
};

export const medicineController = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getAllMedicinesBySellerId,
};