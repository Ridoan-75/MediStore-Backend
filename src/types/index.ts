export * from './medicine.types';
export * from './order.types';
export * from './review.types';
export * from './user.types';
export * from './category.types';

// Common types
export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
  sortOrder?: string;
  sortBy?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}