import React, { useState } from 'react';
import { api } from '../api/client';

// Defining the shape of the data based on your requirement
interface NewProductRequest {
  product: {
    name: string;
    price: number;
  };
}

export default function AddProductFeature() {
  // 1. Logic to handle the Open/Closed state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // 2. Form state
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setErrorMessage(null); // Clear errors when toggling
    setName('');           // Reset fields
    setPrice('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload: NewProductRequest = {
      product: {
        name,
        price: parseFloat(price),
      },
    };

    try {
        const res = await api.post("/products", payload);
        if (res.status === 201) {
          toggleModal(); // Close modal on success
        } else {
          setErrorMessage(res.data.message || "An unexpected error occurred.");
        }
    } catch (error) {
        setErrorMessage(error.response.data["error"] || error.response.data["message"] );
    }
  };

  return (
    <>
      {/* THE TOGGLE BUTTON - Place this in your Header/Toolbar */}
      <button
        onClick={toggleModal}
        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
      >
        + Add Product
      </button>

      {/* THE MODAL OVERLAY */}
      {isOpen && (
        <div  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div  className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">New Product</h2>
              <button onClick={toggleModal} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {/* The Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Displaying your specific error message format if it exists */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 p-2.5 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Coka Cola"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Product Description
                    </label>
                    <textarea
                      className="w-full border border-gray-200 p-2.5 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. A refreshing soft drink"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border border-gray-200 p-2.5 pl-7 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}