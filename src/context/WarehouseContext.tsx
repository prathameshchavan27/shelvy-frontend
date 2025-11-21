import { createContext, useContext, useState } from "react";

const WarehouseContext = createContext<any>(null);

export const WarehouseProvider = ({ children }) => {
  const [warehouseId, setWarehouseId] = useState<number | null>(null);

  return (
    <WarehouseContext.Provider value={{ warehouseId, setWarehouseId }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => useContext(WarehouseContext);
