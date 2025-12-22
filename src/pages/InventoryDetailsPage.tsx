import React, { useState, useEffect } from 'react';
import { InventoryLocationDetailsResponse } from '../features/inventory/types';
import InventorySummaryTable from '../components/InventorySummaryTable'; 
import { getAllInventoryLocations, getInventoryLocationDetails, getInventoryMovementHistory, transferInventory } from '../api/inventory'; 
import { useParams } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import InventoryMovementList from '../components/InventoryMovementList'; 
import { useWarehouse } from '../context/WarehouseContext';

// --- MOCK API ---
interface LocationNames {
    id: number;
    storage_id: string;
}

const mockTransferInventory = async (params: {
    from_location_id: number;
    to_location_id: number;
    items: { [key: number]: { quantity: number } };
}) => {
    console.log('API Payload:', params);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Transfer completed successfully.' };
};

// Helper row
const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-200 py-1 last:border-b-0">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
);

const InventoryDetailsPage: React.FC = () => {
    const { id } = useParams();
    const currentLocId = Number(id);
    const { warehouseId } = useWarehouse();

    // --- STATE ---
    const [data, setData] = useState<InventoryLocationDetailsResponse | null>(null);
    const [allLocations, setAllLocations] = useState<LocationNames[]>([]);

    // ✅ FIXED: payload is OBJECT, not array
    const [transferPayload, setTransferPayload] = useState<{ [key: number]: { quantity: number } }>({});
    const [targetLocationId, setTargetLocationId] = useState<number | null>(null);
    const [isTransferring, setIsTransferring] = useState(false);
    const [isTransferModeActive, setIsTransferModeActive] = useState(false);

    const [inventoryView, setInventoryView] = useState<'products' | 'history'>('products');
    const [movementHistory, setMovementHistory] = useState<any[]>([]);

    // --- EFFECTS ---
    useEffect(() => {
        const fetchData = async () => {
            const locationDetails = await getInventoryLocationDetails(currentLocId);
            setData(locationDetails);

            const locations: LocationNames[] = await getAllInventoryLocations(warehouseId);
            setAllLocations(locations.filter(loc => loc.id !== currentLocId));
        };
        fetchData();
    }, [currentLocId, warehouseId]);

    useEffect(() => {
        if (inventoryView === 'history') {
            getInventoryMovementHistory(currentLocId).then(res => {
                setMovementHistory(res.history);
            });
        }
    }, [inventoryView, currentLocId]);

    // ✅ FIXED: payload update
    const handlePayloadUpdate = (newPayload: { [key: number]: { quantity: number } }) => {
        setTransferPayload(newPayload);
    };

    // --- TRANSFER ACTION ---
    const handleTransfer = async () => {
        if (!targetLocationId || Object.keys(transferPayload).length === 0) {
            alert('Please select a destination location and items to move.');
            return;
        }

        setIsTransferring(true);

        try {
            const result = await transferInventory(
                currentLocId,
                targetLocationId,
                transferPayload // ✅ correct shape
            );

            if (result.success) {
                alert(result.message);
                setTransferPayload({});
                setTargetLocationId(null);
                setIsTransferModeActive(false);

                const refreshed = await getInventoryLocationDetails(currentLocId);
                setData(refreshed);
            }
        } catch (err) {
            console.error(err);
            alert('Transfer failed.');
        } finally {

            setIsTransferring(false);
        }
    };

    const location = data?.location;
    const itemsToMoveCount = Object.keys(transferPayload).length;
    const isTransferButtonEnabled =
        itemsToMoveCount > 0 && targetLocationId !== null && !isTransferring;

    const renderCapacityNote = () => {
        if (!data || !location) return null;
        const totalItems = data.inventory_details.length;
        const maxItems = location.unique_item_limits;
        const utilization = ((totalItems / maxItems) * 100).toFixed(0);

        return (
            <div className="bg-gray-100 p-4 border rounded-lg text-sm text-gray-700 mt-4">
                <b>Note:</b> Unique item utilization {totalItems}/{maxItems} ({utilization}%)
            </div>
        );
    };

    return (
        <div className="h-screen bg-gray-50 p-4 md:p-4">
            <div className="h-full bg-white shadow rounded overflow-hidden border border-gray-200">

                {location ? (
                    <div className="p-6 h-full">
                        <div className="flex flex-col h-full md:flex-row gap-8">

                            {/* LEFT COLUMN */}
                            <div className="md:w-3/12 space-y-4 border-r pr-8">
                                <h2 className="text-2xl font-extrabold text-blue-700">
                                    {location.storage_id} (Source)
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Location ID: #{location.id} in Warehouse #{location.warehouse_id}
                                </p>

                                <div className="p-4 bg-gray-100 rounded-lg space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                                        Location Metrics
                                    </h3>
                                    <DetailRow label="Max Item Types" value={location.unique_item_limits} />
                                    <DetailRow label="Total Capacity" value={`${location.capacity} Units`} />
                                    <DetailRow label="Items Used" value={data.inventory_details.length} />
                                    <DetailRow label="Last Updated" value={new Date(location.updated_at).toLocaleDateString()} />
                                </div>

                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md">
                                    Edit Location
                                </button>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="md:w-9/12 space-y-4">

                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-l text-gray-600 flex space-x-4">
                                        <span
                                            className={`cursor-pointer ${inventoryView === 'products' ? 'font-semibold text-indigo-700 border-b-2 border-indigo-600' : ''}`}
                                            onClick={() => { setInventoryView('products'); setIsTransferModeActive(false); }}
                                        >
                                            Products
                                        </span>
                                        <span
                                            className={`cursor-pointer ${inventoryView === 'history' ? 'font-semibold text-indigo-700 border-b-2 border-indigo-600' : ''}`}
                                            onClick={() => { setInventoryView('history'); setIsTransferModeActive(false); }}
                                        >
                                            History
                                        </span>
                                    </h3>

                                    {(inventoryView === 'products' && itemsToMoveCount>0) && (
                                        <button
                                            onClick={() => setIsTransferModeActive(prev => !prev)}
                                            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg ${
                                                isTransferModeActive
                                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                        >
                                            <ArrowRight size={16} />
                                            <span>{isTransferModeActive ? 'Cancel Transfer' : 'Start Transfer'}</span>
                                        </button>
                                    )}
                                </div>

                                {isTransferModeActive && inventoryView === 'products' && (
                                    <div className="p-4 bg-yellow-50 rounded-lg border">
                                        <h4 className="font-semibold mb-2">
                                            Select Destination ({itemsToMoveCount} selected)
                                        </h4>

                                        <div className="flex gap-4">
                                            <select
                                                value={targetLocationId || ''}
                                                onChange={e => setTargetLocationId(Number(e.target.value))}
                                                className="border p-2 rounded w-full"
                                            >
                                                <option value="">Select Destination...</option>
                                                {allLocations.map(loc => (
                                                    <option key={loc.id} value={loc.id}>
                                                        {loc.storage_id}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={handleTransfer}
                                                disabled={!isTransferButtonEnabled}
                                                className="bg-indigo-600 text-white px-6 rounded disabled:bg-gray-300"
                                            >
                                                {isTransferring ? 'Moving...' : `Confirm Move (${itemsToMoveCount})`}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {inventoryView === 'products' ? (
                                    <div className="bg-white border rounded-lg shadow-md">
                                        <InventorySummaryTable
                                            items={data.inventory_details}
                                            onPayloadChange={handlePayloadUpdate}
                                        />
                                        {renderCapacityNote()}
                                    </div>
                                ) : (
                                    <InventoryMovementList products={movementHistory} />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500 flex items-center justify-center h-full">
                        Loading location and inventory details...
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryDetailsPage;
