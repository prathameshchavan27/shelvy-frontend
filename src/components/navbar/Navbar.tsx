import WarehouseSelector from "./WarehouseSelector";

const Navbar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <nav className="w-full px-6 py-3 border-b bg-white shadow flex items-center justify-between">
      <h6 className="font-semibold text-xl border-b-2 border-black">{title?title:"Shelvy"}</h6>

      {/* Warehouse selector here */}
      <WarehouseSelector />
    </nav>
  );
}

export default Navbar;