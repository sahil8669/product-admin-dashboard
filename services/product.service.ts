import api from "@/lib/axios";
import {
  Product,
  ProductsResponse,
  ProductCategory,
} from "@/types/product";

export const getProducts = async (
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`
  );

  return response.data;
};

export const getProductById = async (
  id: number
): Promise<Product> => {
  const response = await api.get<Product>(
    `/products/${id}`
  );

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(
      query
    )}&limit=${limit}&skip=${skip}`
  );

  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(
      category
    )}?limit=${limit}&skip=${skip}`
  );

  return response.data;
};

export const getCategories = async (): Promise<ProductCategory[]> => {
  const response = await api.get<ProductCategory[]>(
    "/products/categories"
  );

  return response.data;
};

/*
 * Add Product
 */
export interface CreateProductData {
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  brand: string;
}

export const createProduct = async (
  product: CreateProductData
): Promise<Product> => {
  const response = await api.post<Product>(
    "/products/add",
    product
  );

  return response.data;
};

/*
 * Update Product
 */
export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  const response = await api.put<Product>(
    `/products/${id}`,
    product
  );

  return response.data;
};

/*
 * Delete Product
 */
export const deleteProduct = async (
  id: number
): Promise<Product> => {
  const response = await api.delete<Product>(
    `/products/${id}`
  );

  return response.data;
};