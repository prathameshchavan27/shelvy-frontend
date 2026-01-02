import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getAllInventoryLocations, getInventoryLocationsByWarehouse, unbundleInventory } from '../api/inventory';
import { useWarehouse } from '../context/WarehouseContext';

type TabType = 'bundle' | 'unbundle';

interface InventoryLocation {
  id: string;
 storage_id: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  case_pack_qty: number;
  locations: InventoryLocation[];
}

export interface UnbundlePayload {
  bundle_product_id: number;
  quantity: number;
  inventory_location_id: string;
}

const BundlePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('bundle');
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const warehouse = useWarehouse();
  useEffect (() => {
        const fetchData = async () => {
            const locations = await getAllInventoryLocations(warehouse.warehouseId);
            console.log("Locations:", locations);
            setLocations(locations);
        };
        fetchData();
    }, [])
  return (
    <div className="max-w-screen m-6 mx-auto p-6 bg-white">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Inventory Bundle Manager</h1>
        <p className="text-gray-500">Manage stock transformations between individual items and bundles.</p>
      </header>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {['bundle', 'unbundle'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
              activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} Product
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {activeTab === 'bundle' ? <BundleTab /> : <UnbundleTab />}
      </div>
    </div>
  );
};

/**
 * Tab 1: Bundling (Consolidating items from locations)
 */
/**
 * Tab 1: Bundling (Consolidating items from locations into an existing Bundle SKU)
 */
const BundleTab: React.FC = () => {
  const [bundleSkus, setBundleSkus] = useState<any[]>([]);
  const [selectedBundleId, setSelectedBundleId] = useState<number | ''>('');
  const [targetLocation, setTargetLocation] = useState('');
  const [bundleQty, setBundleQty] = useState<number>(1);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  
  // NEW: State for availability data from the backend
  const [availabilityData, setAvailabilityData] = useState<{
    max_bundlable_qty: number;
    source_bins: Array<{
      component_id: number;
      sku: string;
      name: string;
      best_location_id: number;
      bin_name: string;
      available_in_bin: number;
    }>;
  } | null>(null);

  const warehouse = useWarehouse();
  const selectedBundle = bundleSkus.find(b => b.id === selectedBundleId);

  useEffect(() => {
    const fetchData = async () => {
      const bundleRes = await api.get("/unbundles/bundles");
      setBundleSkus(bundleRes.data.bundles);
      const locRes = await getAllInventoryLocations(warehouse.warehouseId);
      setLocations(locRes);
    };
    fetchData();
  }, [warehouse.warehouseId]);

  // NEW: Effect to fetch availability when a bundle is selected
  useEffect(() => {
    if (selectedBundleId) {
        console.log("Selected Bundle ID:", selectedBundleId);
      const fetchAvailability = async () => {
        try {
          const res = await api.get(`/bundles/${selectedBundleId}/bundling_availability`, {
            params: { warehouse_id: warehouse.warehouseId }
          });
          setAvailabilityData(res.data);
          // Set initial qty to 1 or max available, whichever is smaller
          setBundleQty(res.data.max_bundlable_qty > 0 ? 1 : 0);
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      };
      fetchAvailability();
    } else {
      setAvailabilityData(null);
    }
  }, [selectedBundleId, warehouse.warehouseId]);

  const handleBundling = async () => {
    if (!availabilityData) return;

    try {
      const payload = {
        bundle: {
          bundle_product_id: selectedBundleId,
          destination_location_id: targetLocation,
          quantity_to_create: bundleQty,
          // Map the source bins found by the availability logic
          components: availabilityData.source_bins.map(bin => ({
            inventory_location_id: bin.best_location_id,
            product_id: bin.component_id,
            quantity_per_bundle: 1 // Or your specific logic
          }))
        }
      };
      console.log("Bundling Payload:", payload);
      
      await api.post("/bundles/bundle_inventory", payload);
      alert("Bundling successful!");
      // Reset state or refresh data here
    } catch (err) {
      alert("Transaction failed: " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Select Target Bundle</h3>
          <select 
            value={selectedBundleId}
            onChange={(e) => setSelectedBundleId(Number(e.target.value))}
            className="w-full border p-2 rounded bg-white text-sm"
          >
            <option value="">Choose Bundle SKU...</option>
            {bundleSkus.map(b => (
              <option key={b.id} value={b.id}>{b.sku} - {b.name}</option>
            ))}
          </select>

          {availabilityData && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <label className="text-[10px] font-bold text-blue-800 uppercase">Quantity to Create</label>
              <div className="flex items-center gap-4 mt-1">
                <input 
                  type="number" 
                  min="0"
                  max={availabilityData.max_bundlable_qty}
                  value={bundleQty}
                  onChange={(e) => setBundleQty(Math.min(availabilityData.max_bundlable_qty, parseInt(e.target.value) || 0))}
                  className="w-24 border p-2 rounded text-sm font-bold" 
                />
                <span className="text-xs text-blue-600">
                  Max available based on single-bin stock: <strong>{availabilityData.max_bundlable_qty}</strong>
                </span>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold border-b pb-2 pt-4">2. Destination</h3>
          <select 
            value={targetLocation}
            onChange={(e) => setTargetLocation(e.target.value)}
            className="w-full border p-2 rounded bg-white text-sm"
          >
            <option value="">Select Target Bin...</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.storage_id}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
          <h3 className="text-md font-semibold mb-4">3. Source Components (Best Bins)</h3>
          {!availabilityData ? (
            <p className="text-sm text-gray-400 italic">Select a bundle to see where to pull components from.</p>
          ) : (
            <div className="space-y-3">
              {availabilityData.source_bins.map((bin) => (
                <div key={bin.component_id} className="bg-white p-3 rounded border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-gray-800">{bin.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{bin.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-blue-600">Need: {bundleQty}</div>
                      <div className="text-[10px] text-gray-400">In Bin: {bin.available_in_bin}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Auto-selected Bin:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      {bin.bin_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        disabled={!selectedBundleId || !targetLocation || bundleQty <= 0}
        onClick={handleBundling}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          selectedBundleId && targetLocation && bundleQty > 0
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Execute Bundling Transaction
      </button>
    </div>
  );
};
/**
 * Tab 2: Unbundling (Restoring items to locations)
 */

const UnbundleTab: React.FC = () => {
  const [selectedSkuId, setSelectedSkuId] = useState<number | ''>('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [unbundleQty, setUnbundleQty] = useState<number>(1);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [bundleSkus, setBundleSkus] = useState<Array<{ id: number; sku: string; name: string; case_pack_qty: number }>>([]);
  // Find selected product details
  const selectedProduct = bundleSkus.find(b => b.id === selectedSkuId);
  const warehouse = useWarehouse();
  useEffect (() => {
        const fetchData = async () => {
            const res = await api.get("/unbundles/bundles");
            setBundleSkus(res.data.bundles);
            console.log(warehouse)
            const locations = await getAllInventoryLocations(warehouse.warehouseId);
            setLocations(locations);
            console.log(locations.length);
            console.log("Locations:", locations);
        };
        fetchData();
    }, [])

    const unbundle = async () => {
        try {
            const res = await unbundleInventory({
                bundle_product_id: Number(selectedSkuId),
                quantity: unbundleQty,
                inventory_location_id: selectedLocation
            });
            console.log("Unbundle Success:", res.data);
            // Reset selections
            setSelectedSkuId('');
            setSelectedLocation('');
            setUnbundleQty(1);
        } catch (error) {
            alert(error?.response?.data?.error);
            console.error("Unbundle Failed:", error?.response?.data?.error);
        }
    };

  return (
    <div className="p-6">
      <div className="mb-6 bg-amber-50 border border-amber-200 p-6 rounded-lg shadow-sm">
        <h3 className="text-amber-800 font-bold mb-1 text-sm">Unbundle Inventory</h3>
        <p className="text-amber-700 text-[11px] mb-6">This action will deduct bundles from stock and return individual components to inventory.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 1. Select Bundle SKU */}
          <div>
            <label className="block text-[10px] font-bold text-amber-900 mb-1 uppercase tracking-wider">Select Bundle SKU</label>
            <select 
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(Number(e.target.value))}
              className="w-full border-amber-300 p-2 rounded bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="">Choose SKU...</option>
              {bundleSkus.map(b => (
                console.log(b.id),
                <option key={b.id} value={b.id}>{b.sku} - {b.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Select Location */}
          <div>
            <label className="block text-[10px] font-bold text-amber-900 mb-1 uppercase tracking-wider">Inventory Source (Bin)</label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border-amber-300 p-2 rounded bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="">Choose a location...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.storage_id}</option>
              ))}
            </select>
          </div>

          {/* 3. Quantity to Unbundle */}
          <div>
            <label className="block text-[10px] font-bold text-amber-900 mb-1 uppercase tracking-wider">Qty to Unbundle</label>
            <input 
              type="number"
              min="1"
              value={unbundleQty}
              onChange={(e) => setUnbundleQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border-amber-300 p-2 rounded bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            disabled={!selectedLocation || !selectedSkuId}
            onClick={unbundle}
            className={`px-8 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition shadow-sm ${
              (selectedLocation && selectedSkuId) 
                ? 'bg-amber-600 text-white hover:bg-amber-700 active:transform active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Unbundle
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {selectedProduct && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Restoration Preview</h4>
          <table className="min-w-full border border-gray-100 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-[10px] font-bold text-gray-400 uppercase">
                <th className="px-6 py-3">Component to be Restored</th>
                <th className="px-6 py-3">Logic</th>
                <th className="px-6 py-3 text-right">Total Qty to Add Back</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                   <div className="font-semibold text-gray-700">{selectedProduct.name}</div>
                   <div className="text-[10px] text-gray-400">Restoring to Default Bin</div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs italic">
                  {unbundleQty} bundle(s) × {selectedProduct.case_pack_qty} items
                </td>
                <td className="px-6 py-4 text-right">
                   <span className="inline-block bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">
                     + {unbundleQty * selectedProduct.case_pack_qty}
                   </span>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-[11px] text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            This action will decrease {selectedProduct.sku} stock by {unbundleQty} and increase components by {unbundleQty * selectedProduct.case_pack_qty}.
          </p>
        </div>
      )}
    </div>
  );
};

// export default UnbundleTab;
export default BundlePage;