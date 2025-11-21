import { api } from "./client";

export const getInventoryLocationsByWarehouse = async (warehouseId: number) => {
    console.log("Fetching inventory locations for warehouse ID:", warehouseId);
  const response = await api.get(`/inventory_locations/by_warehouse/`, {
    params: { warehouse_id: warehouseId },
  });
  return response.data;
}