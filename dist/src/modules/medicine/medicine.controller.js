import { medicineService } from "./medicine.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
const createMedicine = async (req, res) => {
    try {
        const user = req.user;
        // Convert string values to proper types
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
        const result = await medicineService.createMedicine(payload, user?.id);
        res.status(201).json({
            message: "Medicine created successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error creating medicine:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
const getAllMedicines = async (req, res) => {
    try {
        const { search, minPrice, maxPrice } = req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const minPriceNumber = minPrice
            ? parseFloat(minPrice)
            : undefined;
        const maxPriceNumber = maxPrice
            ? parseFloat(maxPrice)
            : undefined;
        const category = req.query.category;
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
        const result = await medicineService.getAllMedicines({
            search: searchString,
            minPrice: minPriceNumber,
            maxPrice: maxPriceNumber,
            category,
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
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        });
    }
};
const getMedicineById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Medicine ID is required" });
        }
        const medicine = await medicineService.getMedicineById(id);
        res.status(200).json({
            message: "Medicine fetched successfully",
            data: medicine,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        });
    }
};
const deleteMedicine = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Medicine ID is required" });
        }
        const user = req.user;
        await medicineService.deleteMedicine(id, user?.id);
        res.status(200).json({
            message: "Medicine deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        });
    }
};
const updateMedicine = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Medicine ID is required" });
        }
        const user = req.user;
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
        const result = await medicineService.updateMedicine(payload, user?.id, id);
        res.status(200).json({
            message: "Medicine updated successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Something went wrong",
            data: null,
        });
    }
};
const getAllMedicinesBySellerId = async (req, res) => {
    try {
        const user = req.user;
        // console.log("user---------------", user);
        const medicines = await medicineService.getAllMedicinesBySellerId(user?.id);
        res.status(200).json({
            message: "Medicines fetched successfully - seller wise",
            data: medicines,
        });
    }
    catch (error) {
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
    deleteMedicine,
    updateMedicine,
    getAllMedicinesBySellerId,
};
//# sourceMappingURL=medicine.controller.js.map