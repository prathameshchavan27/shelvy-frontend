import { useState, useEffect } from "react";
// Assuming InventoryItemDetail interface includes 'inventory_summary_id'
import { InventoryItemDetail } from "../features/inventory/types"; 

// Define the required props using the existing InventoryItemDetail type
interface InventorySummaryTableProps {
    items: InventoryItemDetail[];
    // Define the required callback prop for the parent component
    onPayloadChange: (payload: { [key: number]: { quantity: number } }) => void; 
}

const InventorySummaryTable: React.FC<InventorySummaryTableProps> = ({ items, onPayloadChange }) => {
    // State to track the input value for the quantity being selected/edited for transfer
    const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});
    
    // Function to handle changes in the input field
    const handleQuantityChange = (index: number, value: string) => {
        const quantity = parseInt(value, 10);
        
        if (quantity >= 0) {
             setSelectedQuantities(prev => {
                if (quantity === 0 || isNaN(quantity)) {
                    const newState = { ...prev };
                    delete newState[index];
                    return newState;
                }
                
                const maxQuantity = items[index].quantity_on_hand;
                const finalQuantity = Math.min(quantity, maxQuantity);

                return {
                    ...prev,
                    [index]: finalQuantity,
                };
            });
        }
    };

    // Helper to check if an item is considered "selected" (i.e., has a quantity > 0)
    const isItemSelected = (index: number) => selectedQuantities[index] && selectedQuantities[index] > 0;

    // Handler for clicking the checkbox
    const handleCheckboxToggle = (index: number) => {
        if (isItemSelected(index)) {
            handleQuantityChange(index, '0');
        } else {
            handleQuantityChange(index, '1');
        }
    }

    /**
     * Maps the selected quantities state to the required service payload format:
     * { inventory_summary_id: { quantity: x } }
     */
    const getTransferPayload = () => {
        const payload: { [key: number]: { quantity: number } } = {};

        Object.entries(selectedQuantities).forEach(([indexStr, quantity]) => {
            const index = parseInt(indexStr, 10);
            const item = items[index];
            
            if (item && quantity > 0) {
                // Accessing item.inventory_summary_id directly from InventoryItemDetail
                payload[item.inventory_summary_id] = { quantity }; 
            }
        });
        
        return payload;
    };
    
    // Call the parent callback whenever selectedQuantities changes
    useEffect(() => {
        const payload = getTransferPayload();
        onPayloadChange(payload);
    }, [selectedQuantities, items ]); 

    return (
        <div className="bg-white border rounded shadow h-full">
            {/* Table Header Row (Desktop/Tablet) */}
            <div className="hidden md:flex w-full bg-gray-100 font-bold text-xs uppercase text-gray-600 border-b">
                <div className="w-5/12 p-3">Product Name / SKU</div>
                <div className="w-2/12 p-3 text-right">On Hand</div>
                <div className="w-2/12 p-3 text-right">Reserved</div>
                <div className="w-3/12 p-3 text-center">Status</div>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-gray-200 h-full">
                {items.map((item, index) => (
                    <div 
                        key={item.inventory_summary_id} // 💡 Using ID as key is often safer than index
                        className={`flex flex-col md:flex-row w-full p-3 transition ${
                            isItemSelected(index) ? 'bg-indigo-50' : 'hover:bg-gray-50'
                        }`}
                    >
                        {/* Column 1: Product Name / SKU */}
                        <div className="flex w-full md:w-5/12 mb-2 md:mb-0 items-center">
                            <div className="pr-3 pt-1">
                                <input 
                                    type="checkbox" 
                                    name={`item-${index}`} 
                                    id={`item-${index}`} 
                                    checked={isItemSelected(index)}
                                    onChange={() => handleCheckboxToggle(index)}
                                />
                            </div>
                            <div className="w-full">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                            </div>
                        </div>
                        
                        {/* Column 2: On Hand (Conditional Display) */}
                        <div className="w-full md:w-2/12 text-left md:text-right mb-1 md:mb-0 flex flex-col md:flex-row justify-end items-start md:items-center space-x-1">
                            <span className="md:hidden text-xs font-semibold text-gray-600">On Hand: </span>
                            
                            {isItemSelected(index) ? (
                                <div className="flex items-center space-x-1 text-sm font-semibold text-gray-800">
                                    <input
                                        type="number"
                                        min="1"
                                        max={item.quantity_on_hand}
                                        value={selectedQuantities[index] === undefined ? 1 : selectedQuantities[index]}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        className="w-10 border border-gray-300 rounded text-center text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-500">/</span>
                                    <span className="text-sm font-semibold text-gray-800">{item.quantity_on_hand}</span>
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-gray-800">
                                    {item.quantity_on_hand}
                                </p>
                            )}
                        </div>

                        {/* Column 3: Reserved */}
                        <div className="w-full md:w-2/12 text-left md:text-right mb-1 md:mb-0">
                            <span className="md:hidden text-xs font-semibold text-gray-600">Reserved: </span>
                            <p className="text-sm text-gray-700">{item.reserved_quantity}</p>
                        </div>

                        {/* Column 4: Status */}
                        <div className="w-full md:w-3/12 text-center mb-1 md:mb-0">
                            <span className="md:hidden text-xs font-semibold text-gray-600">Status: </span>
                            <span className={`mt-20 px-2 py-0.5 text-xs font-medium rounded-full ${
                                item.status === 'Sellable' ? 'bg-green-100 text-green-800' : 
                                item.status === 'Unsellable' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            {items.length === 0 && (
                <p className="p-4 text-center text-gray-500 text-sm">No inventory items are currently assigned to this location.</p>
            )}

        </div>
    );
};

export default InventorySummaryTable;