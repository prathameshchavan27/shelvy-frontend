import React from 'react';

// 1. Define the interface for a single location item
interface LocationItem {
    id: number;
    storage_id: string;
}

// 2. Define the props for the LocationList component
interface LocationListProps {
    locations: LocationItem[]; // An array of location items to display
    onView: (locationId: number, storageId: string) => void; // Callback for the View button click
}

// 3. The LocationList Functional Component
const LocationList: React.FC<LocationListProps> = ({ locations, onView }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Available Locations
            </h3>
            
            {locations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No locations available.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {locations.map((item) => (
                        <li
                            key={`${item.id}-${item.storage_id}`}
                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition duration-150 rounded-md"
                        >
                            <div className="flex-grow">
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold mr-1">Location ID:</span> {item.id},
                                    <span className="font-semibold ml-2 mr-1">Storage ID:</span> {item.storage_id}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => onView(item.id, item.storage_id)}
                                    className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                                >
                                    View
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationList;