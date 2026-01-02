import { NewProductRequest } from "../components/AddProductModal";
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

export const createProduct = async (productData: NewProductRequest) => {
  console.log("Product Data",productData)
  const response = await api.post("/products", productData);
  return response.data;
}


export const lookUpProduct = async(identifier: string) => {
  const response = await api.get(`/products/lookup?barcode=${identifier}`)
  return response.data;
}