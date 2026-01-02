import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { createProduct } from '../api/product';

interface ProductComponent {
  id: number;
  name: string;
  price: string;
}

export interface NewProductRequest {
  product: {
    name: string;
    brand: string;
    price: number;
    is_bundle: boolean;
    case_pack_qty: number; // Added field
    component_ids?: number[];
  };
}

export default function AddProductFeature() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isBundle, setIsBundle] = useState<boolean>(false);
  const [casePackQty, setCasePackQty] = useState<number>(1); // Added State
  const [selectedComponentIds, setSelectedComponentIds] = useState<number[]>([]);
  
  const [availableProducts, setAvailableProducts] = useState<ProductComponent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isBundle && isOpen) {
      api.get("/products").then(res => setAvailableProducts(res.data));
    }
  }, [isBundle, isOpen]);

  // Warning logic: If it's a bundle with only 1 unique component, Case Pack Qty should be > 1
  const showCasePackWarning = isBundle && selectedComponentIds.length === 1 && casePackQty <= 1;

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setErrorMessage(null);
    setName('');
    setBrand('');
    setPrice('');
    setIsBundle(false);
    setCasePackQty(1); // Reset
    setSelectedComponentIds([]);
  };

  const handleComponentToggle = (id: number) => {
    setSelectedComponentIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload: NewProductRequest = {
      product: {
        name,
        brand,
        price: parseFloat(price),
        is_bundle: isBundle,
        case_pack_qty: isBundle ? casePackQty : 1, // Logic for simple products vs bundles
        ...(isBundle && { component_ids: selectedComponentIds })
      },
    };

    console.log("Submitting Payload:", payload);
    try{
        const res = await createProduct(payload);
        console.log(res);
        toggleModal()
    }catch(error){
        console.log(error);
    }
    // await api.post("/products", payload);
  };

  return (
    <>
      <button onClick={toggleModal} className="px-4 py-2 bg-blue-600 text-white rounded shadow">+ Add Product</button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Create {isBundle ? 'Bundle' : 'Standard Product'}</h2>
              <button onClick={toggleModal} className="text-gray-400 text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && <div className="p-3 bg-red-50 text-red-600 text-xs rounded">{errorMessage}</div>}

              {/* IS BUNDLE TOGGLE */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">Is this a bundle?</span>
                <button 
                  type="button"
                  onClick={() => {
                    setIsBundle(!isBundle);
                    if (!isBundle) setCasePackQty(1); // Default for non-bundles
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isBundle ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isBundle ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product Name</label>
                  <input type="text" required className="w-full border p-2 rounded text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Brand</label>
                  <input type="text" required className="w-full border p-2 rounded text-sm" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Total Price</label>
                  <input type="number" step="0.01" required className="w-full border p-2 rounded text-sm" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                
                {/* CASE PACK QTY FIELD (Visible only for bundles) */}
                {isBundle && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Case Pack Qty</label>
                    <input 
                      type="number" 
                      min="1" 
                      required 
                      className={`w-full border p-2 rounded text-sm ${showCasePackWarning ? 'border-amber-500 bg-amber-50' : ''}`}
                      value={casePackQty} 
                      onChange={(e) => setCasePackQty(parseInt(e.target.value) || 1)} 
                    />
                  </div>
                )}
              </div>

              {/* CASE PACK WARNING */}
              {showCasePackWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-[11px] leading-relaxed animate-pulse">
                  <strong>⚠️ Multi-Pack Warning:</strong> You have selected only one component for this bundle. This usually indicates a <strong>Case Pack</strong> (e.g., 3-Pack of Coke). Please ensure Case Pack Qty is greater than 1.
                </div>
              )}

              {/* COMPONENT SELECTION */}
              {isBundle && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Select Components</label>
                  <div className="border rounded-md max-h-40 overflow-y-auto p-2 bg-gray-50">
                    {availableProducts.map(p => (
                      <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-sm">
                        <input 
                          type="checkbox" 
                          checked={selectedComponentIds.includes(p.id)}
                          onChange={() => handleComponentToggle(p.id)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{p.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">${p.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={toggleModal} className="flex-1 px-4 py-2 border rounded text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 shadow-md">
                  Save {isBundle ? 'Bundle' : 'Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}