import { ParsedQs } from "qs";
import { MedicineStatus } from "../../generated/prisma/enums";
import { getSlug } from "./get-slug";

export const filter = (query: ParsedQs) => {
  const { search } = query;

  const searchTerm =
    typeof search === "string" ? getSlug(search.trim()) : undefined;

  // Validate status is a valid MedicineStatus enum value
  const statusValue = query.status as string | undefined;
  const validStatuses = Object.values(MedicineStatus);
  const status =
    statusValue && validStatuses.includes(statusValue as MedicineStatus)
      ? (statusValue as MedicineStatus)
      : undefined;

  const categoryId =
    typeof query.categoryId === "string" ? query.categoryId : undefined;

  const id = typeof query.id === "string" ? query.id : undefined;

  return { searchTerm, status, categoryId, id };
};
