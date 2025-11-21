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
          setWarehouses(res.data.warehouses);
          setWarehouseId(res.data.warehouses[0]["id"]);
        } catch (err) {
        console.error("Failed to load warehouses", err);
        }
    };
    fetchWarehouses();
  }, []);

  return (
    <select
      className="rounded-full border border-gray-300 bg-white px-4 py-2
      text-gray-800 shadow-sm focus:border-indigo-400 focus:ring-2
      focus:ring-indigo-300 appearance-none cursor-pointer transition"
      value={warehouseId ?? ""}
      onChange={(e) => {console.log("ID:", e.target.value); setWarehouseId(Number(e.target.value));}}
    >
      {warehouses.map((wh: any) => (
        <option key={wh.id} value={wh.id}>
          {wh.name}
        </option>
      ))}
    </select>
  );
}
