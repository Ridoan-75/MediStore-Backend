import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Category } from "../../../generated/prisma/client";
import { getSlug } from "../../helpers/get-slug";
import { sendJSON } from "../../helpers/send-json";
import { categoryServices } from "./category-services";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: Category = req.body;
    payload.slug = getSlug(payload.name);

    const result = await categoryServices.createCategory(payload);
    return sendJSON(true, res, 201, "Category created successfully", result);
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      throw createError(400, "Slug parameter is required");
    }
    if (typeof slug !== "string") {
      throw createError(400, "Slug parameter must be a string");
    }
    const result = await categoryServices.getCategoryBySlug(slug);
    return sendJSON(true, res, 200, "Category retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw createError(400, "ID parameter is required");
    }
    if (typeof id !== "string") {
      throw createError(400, "ID parameter must be a string");
    }
    const result = await categoryServices.getCategoryById(id);
    return sendJSON(true, res, 200, "Category retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw createError(400, "ID parameter is required");
    }
    if (typeof id !== "string") {
      throw createError(400, "ID parameter must be a string");
    }
    const payload: Partial<Category> = req.body;
    const result = await categoryServices.updateCategoryById(id, payload);
    return sendJSON(true, res, 200, "Category updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw createError(400, "ID parameter is required");
    }
    if (typeof id !== "string") {
      throw createError(400, "ID parameter must be a string");
    }

    await categoryServices.deleteCategoryById(id);
    return sendJSON(true, res, 200, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryServices.getAllCategories();
    return sendJSON(
      true,
      res,
      200,
      "Categories retrieved successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const categoryControllers = {
  createCategory,
  getCategoryBySlug,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
};
