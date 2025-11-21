import { api } from "./client";

export const getProducts = async () => {
  const response = await api.get("/products");
  console.log("API Response:", response);
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
}
