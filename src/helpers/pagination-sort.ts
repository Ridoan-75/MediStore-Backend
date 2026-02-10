import { ParsedQs } from "qs";
export const paginationSort = (query: ParsedQs) => {
  const rawPage = query.page ? parseInt(query.page as string, 10) : 1;
  const rawLimit = query.limit ? parseInt(query.limit as string, 10) : 10;

  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = isNaN(rawLimit) || rawLimit < 1 ? 10 : rawLimit;

  const sortBy = query.sortBy ? (query.sortBy as string) : "createdAt";
  const rawSortOrder = query.sortOrder
    ? (query.sortOrder as string).toLowerCase()
    : "desc";
  const sortOrder = rawSortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;

  return { page, limit, skip, sortBy, sortOrder };
};
