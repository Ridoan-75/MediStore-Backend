export interface CreateCategoryInput {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  imageUrl?: string;
}