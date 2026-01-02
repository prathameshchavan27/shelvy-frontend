import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScanBarcode, PackageCheck, AlertCircle, CheckCircle2, Loader2, Undo2 } from 'lucide-react';
import { lookUpProduct } from '../api/product';
import { api } from '../api/client';
import { getAvailableCapacity } from '../api/inventory';
import { useWarehouse } from '../context/WarehouseContext';

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
}

interface Location {
  id: number;
  storage_id: string;
  available_capacity: number;
}

const ReceivingPage: React.FC = () => {
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [receivingData, setReceivingData] = useState({ quantity: 1, location_id: '', product_id: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [locations, setLocations] = useState<Location[]>([]);
  
  const warehouse = useWarehouse(); // Default warehouse
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Fetch available locations from your API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getAvailableCapacity(warehouse.warehouseId);
        console.log(response.capacity);
        setLocations(response.capacity);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    };
    fetchLocations();
  }, [receivingData.quantity, warehouse.warehouseId]);

  // Filter locations based on quantity entered
  const availableBins = useMemo(() => {
    const qty = parseInt(receivingData.quantity) || 1;
    return locations.filter(loc => loc.available_capacity >= qty);
  }, [receivingData.quantity, locations]);

  // Keep focus on the hidden input so any paste/scan is captured automatically
  useEffect(() => {
    if (!scannedProduct && !status.success) {
      hiddenInputRef.current?.focus();
    }
  }, [scannedProduct, status.success]);

  const handleContainerClick = () => {
    hiddenInputRef.current?.focus();
  };

  const handlePasteOrScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (!val) return;

    setStatus({ loading: true, error: '', success: '' });

    const product = await lookUpProduct(val);
    if (product) {
      receivingData.product_id=product.id;
      setScannedProduct(product);
      setStatus({ loading: false, error: '', success: '' });
    } else {
      setStatus({ loading: false, error: `SKU/Barcode "${val}" not recognized.`, success: '' });
      e.target.value = ''; 
    }
  };

  const handleReceiveInventory = async () => {
    setStatus({ ...status, loading: true });
    console.log("Receiving Data Submitted:", receivingData);
    const res = await api.post('/receivings/receive_inventory', { receiving: receivingData });
    console.log("API Response:", res);
    if (res.error) {
      setStatus({ loading: false, error: res.error, success: '' });
      return;
    }
    setStatus({ loading: false, error: '', success: `Received ${receivingData.quantity} units.` });
  };

  const resetForm = () => {
    setScannedProduct(null);
    setReceivingData({ quantity: '', location_id: '', product_id: '' });
    setStatus({ loading: false, error: '', success: '' });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 h-full flex flex-col justify-center">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3">
          <PackageCheck className="text-blue-600" />
          Receiving Dock
        </h1>
      </header>

      {status.error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-2 justify-center">
          <AlertCircle size={20} /> {status.error}
        </div>
      )}

      {status.success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 flex items-center gap-2 justify-center">
          <CheckCircle2 size={20} /> {status.success}
        </div>
      )}

      {!scannedProduct && !status.success && (
        <div 
          onClick={handleContainerClick}
          className={`
            relative group cursor-pointer border-4 border-dashed rounded-[2.5rem] p-16
            flex flex-col items-center justify-center transition-all duration-300
            ${status.loading ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-white'}
          `}
        >
          <input
            ref={hiddenInputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            onChange={handlePasteOrScan}
            autoFocus
          />

          <div className={`p-8 rounded-full mb-6 transition-transform duration-500 ${status.loading ? 'animate-spin' : 'group-hover:scale-110'}`}>
            {status.loading ? (
              <Loader2 size={80} className="text-blue-500" />
            ) : (
              <ScanBarcode size={80} className="text-gray-400 group-hover:text-blue-500" />
            )}
          </div>

          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            {status.loading ? 'Searching Catalog...' : 'Ready to Scan'}
          </h2>
          <p className="text-gray-400 text-center max-w-xs">
            Paste barcode anywhere in this box or trigger your scanner now.
          </p>

          <div className="mt-8 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scanner Active</span>
          </div>
        </div>
      )}

      {scannedProduct && !status.success && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-blue-600 p-8 text-white flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Identified Product</p>
              <h2 className="text-3xl font-bold">{scannedProduct.name}</h2>
              <p className="font-mono text-blue-100 mt-1">{scannedProduct.sku}</p>
            </div>
            <button onClick={resetForm} className="p-2 hover:bg-blue-500 rounded-full text-white">
              <Undo2 size={28} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-500 uppercase tracking-tighter">Quantity</label>
                <input 
                  autoFocus
                  type="number" 
                  value={receivingData.quantity}
                  onChange={(e) => setReceivingData({...receivingData, quantity: e.target.value, location_id: ''})}
                  className="w-full text-4xl font-bold border-b-4 border-gray-100 p-2 outline-none focus:border-blue-500 transition-all" 
                  placeholder="1"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-500 uppercase tracking-tighter">Bin Location</label>
                <select 
                  value={receivingData.location_id}
                  disabled={!receivingData.quantity || parseInt(receivingData.quantity) <= 0}
                  onChange={(e) => setReceivingData({...receivingData, location_id: e.target.value})}
                  className="w-full h-[60px] text-2xl font-bold border-b-4 border-gray-100 outline-none focus:border-blue-500 transition-all bg-transparent disabled:opacity-30"
                >
                  <option value="">Select Bin</option>
                  {availableBins.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.storage_id} ({loc.available_capacity} units capacity available)
                    </option>
                  ))}
                </select>
                {receivingData.quantity && parseInt(receivingData.quantity) > 0 && availableBins.length === 0 && (
                  <p className="text-red-500 text-xs font-bold">No bins available for this quantity</p>
                )}
              </div>
            </div>

            <button 
              onClick={handleReceiveInventory}
              disabled={status.loading || !receivingData.quantity || !receivingData.location_id}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 text-white font-black py-6 rounded-2xl text-xl shadow-xl shadow-green-100 transition-all"
            >
              {status.loading ? "Processing..." : "Complete Receipt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivingPage;