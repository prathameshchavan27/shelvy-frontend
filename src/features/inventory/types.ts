export interface InventoryLocation {
  id: number;
  storage_id: string;
}

export interface InventoryDetail {
  name: string;
  sku: string;
  quantity_on_hand: number;
  reserved_quantity: number;
  status: string;
}

export interface InventoryLocationDetailsResponse {
  location: {
    id: number;
    storage_id: string;
    unique_item_limits: number;
    capacity: number;
    warehouse_id: number;
    created_at: string;
    updated_at: string;
  };
  inventory_details: InventoryDetail[];
}

export interface InventoryItemDetail {
    inventory_summary_id: number;
    name: string;
    sku: string;
    quantity_on_hand: number;
    reserved_quantity: number;
    status: string; // e.g., "Sellable", "Quarantined", "Damaged"
}

// Defines the structure for the location itself
export interface LocationData {
    id: number;
    storage_id: string; // e.g., "BIN-01"
    unique_item_limits: number;
    capacity: number; // Maximum capacity (e.g., in cubic feet or units)
    warehouse_id: number;
    created_at: string;
    updated_at: string;
}