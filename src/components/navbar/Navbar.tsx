import WarehouseSelector from "./WarehouseSelector";

const Navbar: React.FC<{ title: React.ReactNode }> = ({ title }) => {
  return (
    <nav className="w-full px-6 py-3 border-b bg-white shadow flex items-center justify-between">
      {/* Render the title prop directly, whether it's a string or a component */}
      <h6 className="font-semibold text-xl border-b-2 border-black">
        {title ? title : "Shelvy"}
      </h6>

      {/* Warehouse selector here */}
      <WarehouseSelector />
    </nav>
  );
}

export default Navbar;