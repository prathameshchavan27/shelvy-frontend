import { api } from "./client";

export const getProducts = async () => {
  const response = await api.get("/products");
  console.log("API Response:", response);
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}.json`);
  return response.data;
}

export const createProduct = async (productData: { name: string; sku: string; description?: string; price: number; }) => {
  const response = await api.post("/products", { product: productData });
  return response.data;
}
