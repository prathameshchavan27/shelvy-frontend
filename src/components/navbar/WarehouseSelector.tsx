import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { useWarehouse } from "../../context/WarehouseContext";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function WarehouseSelector() {
  const { warehouseId, setWarehouseId } = useWarehouse();
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await api.get("/warehouses");
        const whs = res.data.warehouses;
        setWarehouses(whs);
        if (!warehouseId && whs.length > 0) setWarehouseId(whs[0].id);
      } catch (err) {
        console.error("Failed to load warehouses", err);
      }
    };
    fetchWarehouses();
  }, []);

  return (
    <Select.Root 
      value={warehouseId?.toString()} 
      onValueChange={(val) => setWarehouseId(Number(val))}
    >
      <Select.Trigger 
        className="inline-flex items-center justify-between rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none min-w-[180px]"
      >
        <Select.Value placeholder="Select Warehouse" />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content 
          position="popper" 
          sideOffset={5}
          className="z-50 min-w-[200px] overflow-hidden rounded-xl bg-[#2D2D30] p-1 text-white shadow-xl animate-in fade-in zoom-in duration-100"
        >
          <Select.Viewport className="p-1">
            {warehouses.map((wh: any) => (
              <Select.Item
                key={wh.id}
                value={wh.id.toString()}
                className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-10 pr-4 text-sm outline-none hover:bg-blue-600 focus:bg-blue-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
                  <Select.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{wh.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}