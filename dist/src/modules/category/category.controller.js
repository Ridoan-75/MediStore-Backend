import { categoryService } from "./category.service";
const createCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const result = await categoryService.createCategory(req.body);
        res.status(201).json({
            message: "Category created successfully",
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
const getAllCategories = async (req, res) => {
    try {
        const result = await categoryService.getAllCategories();
        res.status(200).json({
            message: "Categories fetched successfully",
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
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const result = await categoryService.getCategoryById(categoryId);
        if (!result) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category fetched successfully",
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
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const result = await categoryService.updateCategory(categoryId, req.body);
        res.status(200).json({
            message: "Category updated successfully",
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
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const result = await categoryService.deleteCategory(categoryId);
        res.status(200).json({
            message: "Category deleted successfully",
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
export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=category.controller.js.map