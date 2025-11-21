import React from 'react';

// 1. Define specific interfaces for clear typing
interface ProductData {
    id: number;
    name: string;
    sku: string;
    description: string;
    price: string;
    is_bundle: boolean;
    [key: string]: any; 
}

// Using the structure derived from the InventoryPage usage, ensuring compatibility
interface LocationData { 
    id: number; 
    storage_id: string;
    [key: string]: any;
}

// Export the union type for use in parent components
export type ListItem = ProductData | LocationData; 

interface ListProps {
    items: ListItem[]; 
    onView: (item: ListItem) => void; 
    getTitle: (item: ListItem) => string;
    getDetails: (item: ListItem) => string;
    // NOTE: Action heading is missing from your columnHeadings definition,
    // but the component relies on it. I will keep it optional here but use a fallback.
    columnHeadings: {
        title: string;
        details: string;
        action?: string; // Made optional to prevent TypeScript error if not provided
    };
}

const List: React.FC<ListProps> = ({ 
    items, 
    onView, 
    getTitle, 
    getDetails,
    columnHeadings 
}) => {
    // Define consistent column widths (4/12, 6/12, 2/12 = 100%)
    const WIDTH_TITLE = "md:w-4/12";
    const WIDTH_DETAILS = "md:w-6/12";
    const WIDTH_ACTION = "md:w-2/12";

    return (
        <div className="w-full bg-white my-4 shadow-md rounded-lg overflow-hidden border border-gray-100">
            
            {/* Table Header (Mimicking Thead) */}
            {/* Added bg-gray-50 for subtle distinction as per your inventory screenshot */}
            <div className="hidden md:flex bg-gray-50 border-b-2 border-black text-sm font-semibold text-gray-700 uppercase tracking-wider">
                
                {/* Column 1: Title */}
                <div className={`${WIDTH_TITLE} py-3 px-4 text-left`}>{columnHeadings.title}</div>
                
                {/* Column 2: Details */}
                <div className={`${WIDTH_DETAILS} py-3 px-4 text-left`}>{columnHeadings.details}</div>
                
                {/* Column 3: Action */}
                <div className={`${WIDTH_ACTION} py-3 px-4 text-center`}>{columnHeadings.action || "Action"}</div>
            </div>

            {/* List Body (Mimicking Tbody) */}
            <ul className="divide-y divide-gray-100">
                {items.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">No items found.</p>
                ) : (
                    items.map((item) => (
                        <li 
                            key={item.id} 
                            // Use flex on desktop (md:) to align columns, and block on mobile
                            className="flex flex-col md:flex-row items-start md:items-center p-4 hover:bg-gray-50 transition duration-150"
                        >
                            {/* Column 1: Title */}
                            <div className={`w-full ${WIDTH_TITLE} pr-2 pl-2 mb-2 md:mb-0`}>
                                <span className="md:hidden font-semibold text-gray-700">{columnHeadings.title}: </span>
                                <p className="text-md font-medium text-gray-900">{getTitle(item)}</p>
                            </div>
                            
                            {/* Column 2: Details */}
                            <div className={`w-full ${WIDTH_DETAILS} pr-2 pl-2 mb-2 md:mb-0`}>
                                <span className="md:hidden font-semibold text-gray-700">{columnHeadings.details}: </span>
                                <p className="text-sm text-gray-600">{getDetails(item)}</p>
                            </div>

                            {/* Column 3: Action Button */}
                            <div className={`w-full ${WIDTH_ACTION} flex justify-start md:justify-center pt-2 md:pt-0`}>
                                <button
                                    onClick={() => onView(item)}
                                    className="px-4 py-1 border border-blue-500 text-blue-500 text-sm font-medium rounded-full hover:bg-blue-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    View
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default List;