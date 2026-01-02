import { UnbundlePayload } from "../pages/BundlesPage";
import { api } from "./client";

export const getInventoryLocationsByWarehouse = async (warehouseId: number) => {
    console.log("Fetching inventory locations for warehouse ID:", warehouseId);
  const response = await api.get(`/inventory_locations/by_warehouse/`, {
    params: { warehouse_id: warehouseId },
  });
  return response.data;
}

export const getInventoryLocationDetails = async (locationId: number) => {
    console.log("Fetching inventory location details for location ID:", locationId);
  const response = await api.get(`/inventory_locations/${locationId}`);
  return response.data;
}

export const getInventoryMovementHistory = async (locationId: number) => {
  console.log("Fetching inventory movement history for location ID:", locationId);
  const response = await api.get(`/inventory_locations/${locationId}/history`);
  return response.data;
}

export const getAllInventoryLocations = async (warehouseId: number) => {
  console.log("Fetching all inventory locations");
  const response = await api.get(`/inventory_transfers/locations_to_transfer`, {
    params: { warehouse_id: warehouseId },
  });
  return response.data.locations;
}

export const transferInventory = async (fromLocationId: number, toLocationId: number, payload: { [key: number]: { quantity: number } }) => {
  console.log("Transferring inventory from location ID:", fromLocationId, "to location ID:", toLocationId, "with payload:", payload);
  const response = await api.post(`/inventory_transfers/transfer_inventory`, {
    transfer_params: {
      source_location_id: fromLocationId,
      destination_location_id: toLocationId,
      items: payload,
    },
  });
  return response.data;
}

export const unbundleInventory = async (unbundleData: UnbundlePayload) => {
  const response = await api.post(`/unbundles/unbundle`, { unbundle: unbundleData});
  return response.data;
}

export const getAvailableCapacity = async (warehouseId: number) => {
  console.log("Fetching available capacity for warehouse ID:", warehouseId);
  const response = await api.get(`/inventory_locations/available_capacity`, {
    params: { warehouse_id: warehouseId },
  });
  return response.data;
}
