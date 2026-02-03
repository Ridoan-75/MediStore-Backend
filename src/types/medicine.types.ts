export interface CreateMedicineInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  manufacturer?: string;
  type?: string;
}

export interface UpdateMedicineInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
  manufacturer?: string;
  type?: string;
}

export interface MedicineFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}