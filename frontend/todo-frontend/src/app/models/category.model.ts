export interface Category {
  id: number;
  name: string;
  color: string;
  description?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category | Category[];
}
