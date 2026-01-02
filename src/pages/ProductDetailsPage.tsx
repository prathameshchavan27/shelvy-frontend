// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getProductById } from '../api/product';
// import { api } from '../api/client';
// import { useAuth } from '../store/authStore';

// // Define the shape of a component within a bundle
// interface BundleComponent {
//     id: number;
//     name: string;
//     sku: string;
//     price: string;
// }

// interface Product {
//     id: number;
//     name: string;
//     sku: string;
//     brand: string;
//     description: string;
//     is_bundle: boolean;
//     case_pack_qty: number;
//     upc?: string; 
//     imageUrl?: string;
//     components?: BundleComponent[]; // Added to handle bundle data
// }

// interface Attribute {
//     id: number;
//     name: string;
//     value: string;
// }

// const dummyAttributes: Attribute[] = [
//     { id: 101, name: "Weight", value: "1.5 kg" },
//     { id: 102, name: "Color", value: "Brown" },
//     { id: 103, name: "Vendor", value: "Global Beans Co." },
//     { id: 104, name: "Category", value: "Beverages" },
// ];

// const ProductDetailsPage: React.FC = () => {
//     const { id } = useParams();
//     const [product, setProduct] = useState<Product>();
//     const [attributes, setAttributes] = useState<Attribute[]>([]); 
//     const [isEditing, setIsEditing] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const { role } = useAuth()

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const response: Product = await getProductById(Number(id));
//                 setProduct({
//                     ...response,
//                     upc: '012345678905',
//                     imageUrl: 'https://via.placeholder.com/300x300?text=Product+Image',
//                 });
//                 setAttributes(dummyAttributes);
//             } catch (error) {
//                 console.error("Failed to fetch product:", error);
//             }
//         };
//         fetchProduct();
//     }, [id]);

//     const handleSave = async () => {
//         if (!product) return;
        
//         setIsLoading(true);
//         try {
//             const patchPayload = {
//                 product: {
//                     name: product.name,
//                     description: product.description,
//                     is_bundle: product.is_bundle,
//                 }
//             };
            
//             await api.patch(`/products/${product.id}`, patchPayload);
//             setIsEditing(false);
//         } catch (error) {
//             console.error("Failed to update product:", error);
//             alert("Error saving product changes.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const renderDetailRow = (label: string, value: string | undefined, isBoolean: boolean = false) => (
//         <div className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
//             <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight w-1/3">{label}:</span>
//             <div className="w-2/3 text-right">
//                 {isBoolean ? (
//                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{value}</span>
//                 ) : (
//                     <span className="text-xs font-medium text-gray-700">{value || 'N/A'}</span>
//                 )}
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col w-full">
//             <main className="flex-grow w-full py-6">
//                 <div className="w-full bg-white border-y md:border-x border-gray-200 shadow-sm min-h-[calc(100vh-80px)]">
                    
//                     {product ? (
//                         <div className="p-6 md:p-10">
//                             <div className="flex flex-col lg:flex-row gap-12">

//                                 <div className="lg:w-3/12 space-y-6">
//                                     {isEditing ? (
//                                         <input 
//                                             className="text-xl font-bold border-b-2 border-blue-500 text-gray-900 tracking-tight w-full focus:outline-none"
//                                             value={product.name}
//                                             onChange={(e) => setProduct({...product, name: e.target.value})}
//                                         />
//                                     ) : (
//                                         <h2 className="text-xl font-bold border-b-2 border-black text-gray-900 tracking-tight">{product.name}</h2>
//                                     )}
                                    
//                                     <div className="aspect-square border border-gray-100 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
//                                         <img 
//                                             src={product.imageUrl} 
//                                             alt={product.name} 
//                                             className="w-full h-full object-contain" 
//                                         />
//                                     </div>
                                    
//                                     <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-lg space-y-4">
//                                         {renderDetailRow("SKU", product.sku)}
//                                         {renderDetailRow("UPC", product.upc)}
//                                         {renderDetailRow("BRAND", product.brand)}
//                                         {renderDetailRow("Bundle", product.is_bundle ? "YES" : "NO", true)}
//                                     </div>
//                                 </div>

//                                 <div className="lg:w-9/12 space-y-8">
//                                     <div className="flex justify-between items-center border-b border-gray-100 pb-4">
//                                         <h3 className="text-lg font-semibold text-gray-700">Description & Attributes</h3>
//                                         {role!=='staff' && <div className="flex gap-3">
//                                             {!isEditing ? (
//                                                 <button 
//                                                     onClick={() => setIsEditing(true)}
//                                                     className="px-5 py-1.5 text-xs font-bold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all uppercase tracking-wider"
//                                                 >
//                                                     Edit Details
//                                                 </button>
//                                             ) : (
//                                                 <>
//                                                     <button 
//                                                         disabled={isLoading}
//                                                         onClick={() => setIsEditing(false)}
//                                                         className="px-5 py-1.5 text-xs font-bold text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 transition-all uppercase tracking-wider disabled:opacity-50"
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                     <button 
//                                                         disabled={isLoading}
//                                                         onClick={handleSave}
//                                                         className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all uppercase tracking-wider disabled:opacity-50"
//                                                     >
//                                                         {isLoading ? "Saving..." : "Save"}
//                                                     </button>
//                                                 </>
//                                             )}
//                                         </div>}
//                                     </div>
                                    
//                                     <div className="space-y-3">
//                                         <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Description:</h4>
//                                         <div className="bg-white p-5 border border-gray-200 rounded shadow-sm min-h-[140px]">
//                                             {isEditing ? (
//                                                 <textarea 
//                                                     className="w-full h-full min-h-[100px] text-sm text-gray-700 focus:outline-none resize-none"
//                                                     value={product.description}
//                                                     onChange={(e) => setProduct({...product, description: e.target.value})}
//                                                 />
//                                             ) : (
//                                                 <p className="text-sm text-gray-600 leading-relaxed italic">{product.description}</p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* NEW: Bundle Components Section */}
//                                     {product.is_bundle && product.components && product.components.length > 0 && (
//                                         <div className="space-y-3">
//                                             <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Bundle Components:</h4>
//                                             <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//                                                 <table className="w-full text-left text-sm">
//                                                     <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-bold">
//                                                         <tr>
//                                                             <th className="px-6 py-3">Component Name</th>
//                                                             <th className="px-6 py-3 text-right">SKU</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className="divide-y divide-gray-100">
//                                                         {product.components.map((comp) => (
//                                                             <tr key={comp.id} className="bg-white">
//                                                                 <td className="px-6 py-3 text-gray-700 font-medium">{comp.name}</td>
//                                                                 <td className="px-6 py-3 text-right font-mono text-xs text-blue-600 font-bold">{comp.sku}</td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div className="border border-gray-200 rounded overflow-hidden">
//                                         <div className="bg-white p-4 border-b border-gray-200">
//                                             <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Specifications</h4>
//                                         </div>
                                        
//                                         <div className="flex w-full bg-gray-50 font-bold text-[10px] uppercase text-gray-500 tracking-wider border-b border-gray-200">
//                                             <div className="w-1/3 p-3 px-6">Attribute</div>
//                                             <div className="w-2/3 p-3 px-6">Value</div>
//                                         </div>

//                                         <div className="divide-y divide-gray-100">
//                                             <div className="flex w-full items-center py-4 bg-white">
//                                                 <div className="w-1/3 text-xs font-semibold text-gray-600 px-6">Is Bundle</div>
//                                                 <div className="w-2/3 px-6">
//                                                     {isEditing ? (
//                                                         <button 
//                                                             type="button"
//                                                             onClick={() => setProduct({...product, is_bundle: !product.is_bundle})}
//                                                             className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${product.is_bundle ? 'bg-blue-600' : 'bg-gray-200'}`}
//                                                         >
//                                                             <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${product.is_bundle ? 'translate-x-6' : 'translate-x-1'}`} />
//                                                         </button>
//                                                     ) : (
//                                                         <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded uppercase tracking-tighter">
//                                                             {product.is_bundle ? "YES" : "NO"}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             {attributes.map(attr => (
//                                                 <div key={attr.id} className="flex w-full items-center py-4 bg-white">
//                                                     <div className="w-1/3 text-xs font-semibold text-gray-600 px-6">{attr.name}</div>
//                                                     <div className="w-2/3 px-6">
//                                                         {isEditing ? (
//                                                             <input 
//                                                                 type="text"
//                                                                 className="w-full text-xs text-gray-700 border-b border-gray-200 focus:border-blue-400 focus:outline-none py-1"
//                                                                 value={attr.value}
//                                                                 onChange={(e) => setAttributes(attributes.map(a => a.id === attr.id ? {...a, value: e.target.value} : a))}
//                                                             />
//                                                         ) : (
//                                                             <span className="text-xs text-gray-700 font-medium">{attr.value}</span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="flex items-center justify-center h-full text-gray-400 italic">
//                             Loading product information...
//                         </div>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default ProductDetailsPage;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/product';
import { api } from '../api/client';
import { useAuth } from '../store/authStore';

interface BundleComponent {
    id: number;
    name: string;
    sku: string;
    price: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    brand: string;
    barcode: string;
    description: string;
    is_bundle: boolean;
    case_pack_qty: number;
    price: string; // Added price to interface
    upc?: string; 
    imageUrl?: string;
    components?: BundleComponent[];
}

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { role } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response: Product = await getProductById(Number(id));
                setProduct({
                    ...response,
                    upc: '012345678905', // Logic for placeholder
                    imageUrl: 'https://via.placeholder.com/300x300?text=Product+Image',
                });
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSave = async () => {
        if (!product) return;
        
        setIsLoading(true);
        try {
            const patchPayload = {
                product: {
                    name: product.name,
                    description: product.description,
                    // is_bundle: product.is_bundle,
                    case_pack_qty: product.case_pack_qty,
                    price: product.price
                }
            };
            
            await api.patch(`/products/${product.id}`, patchPayload);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update product:", error);
            alert("Error saving product changes.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderDetailRow = (label: string, value: string | number | undefined, isBoolean: boolean = false) => (
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight w-1/3">{label}:</span>
            <div className="w-2/3 text-right">
                {isBoolean ? (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{value}</span>
                ) : (
                    <span className="text-xs font-medium text-gray-700">{value || 'N/A'}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col w-full">
            <main className="flex-grow w-full py-6">
                <div className="w-full bg-white border-y md:border-x border-gray-200 shadow-sm min-h-[calc(100vh-80px)]">
                    
                    {product ? (
                        <div className="p-6 md:p-10">
                            <div className="flex flex-col lg:flex-row gap-12">

                                <div className="lg:w-3/12 space-y-6">
                                    {isEditing ? (
                                        <input 
                                            className="text-xl font-bold border-b-2 border-blue-500 text-gray-900 tracking-tight w-full focus:outline-none"
                                            value={product.name}
                                            onChange={(e) => setProduct({...product, name: e.target.value})}
                                        />
                                    ) : (
                                        <h2 className="text-xl font-bold border-b-2 border-black text-gray-900 tracking-tight">{product.name}</h2>
                                    )}
                                    
                                    <div className="aspect-square border border-gray-100 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    
                                    <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-lg space-y-4">
                                        {renderDetailRow("SKU", product.sku)}
                                        {renderDetailRow("UPC", product.barcode)}
                                        {renderDetailRow("BRAND", product.brand)}
                                        {renderDetailRow("Bundle", product.is_bundle ? "YES" : "NO", true)}
                                    </div>
                                </div>

                                <div className="lg:w-9/12 space-y-8">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Description & Attributes</h3>
                                        {role!=='staff' && <div className="flex gap-3">
                                            {!isEditing ? (
                                                <button onClick={() => setIsEditing(true)} className="px-5 py-1.5 text-xs font-bold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all uppercase tracking-wider">
                                                    Edit Details
                                                </button>
                                            ) : (
                                                <>
                                                    <button disabled={isLoading} onClick={() => setIsEditing(false)} className="px-5 py-1.5 text-xs font-bold text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 transition-all uppercase tracking-wider">
                                                        Cancel
                                                    </button>
                                                    <button disabled={isLoading} onClick={handleSave} className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all uppercase tracking-wider">
                                                        {isLoading ? "Saving..." : "Save"}
                                                    </button>
                                                </>
                                            )}
                                        </div>}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Description:</h4>
                                        <div className="bg-white p-5 border border-gray-200 rounded shadow-sm min-h-[140px]">
                                            {isEditing ? (
                                                <textarea 
                                                    className="w-full h-full min-h-[100px] text-sm text-gray-700 focus:outline-none resize-none"
                                                    value={product.description || ''}
                                                    onChange={(e) => setProduct({...product, description: e.target.value})}
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-600 leading-relaxed italic">{product.description || 'No description available.'}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bundle Components Section */}
                                    {product.is_bundle && product.components && product.components.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Bundle Components:</h4>
                                            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-bold">
                                                        <tr>
                                                            <th className="px-6 py-3">Component Name</th>
                                                            <th className="px-6 py-3 text-right">SKU</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {product.components.map((comp) => (
                                                            <tr key={comp.id} className="bg-white">
                                                                <td className="px-6 py-3 text-gray-700 font-medium">{comp.name}</td>
                                                                <td className="px-6 py-3 text-right font-mono text-xs text-blue-600 font-bold">{comp.sku}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border border-gray-200 rounded overflow-hidden">
                                        <div className="bg-white p-4 border-b border-gray-200">
                                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Specifications</h4>
                                        </div>
                                        
                                        <div className="flex w-full bg-gray-50 font-bold text-[10px] uppercase text-gray-500 tracking-wider border-b border-gray-200">
                                            <div className="w-1/3 p-3 px-6">Attribute</div>
                                            <div className="w-2/3 p-3 px-6">Value</div>
                                        </div>

                                        <div className="divide-y divide-gray-100">
                                            {/* Price Attribute */}
                                            <div className="flex w-full items-center py-4 bg-white">
                                                <div className="w-1/3 text-xs font-semibold text-gray-600 px-6">Price</div>
                                                <div className="w-2/3 px-6">
                                                    {isEditing ? (
                                                        <input 
                                                            type="number"
                                                            className="w-full text-xs text-gray-700 border-b border-gray-200 focus:border-blue-400 focus:outline-none py-1"
                                                            value={product.price}
                                                            onChange={(e) => setProduct({...product, price: e.target.value})}
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-700 font-medium">₹{parseFloat(product.price).toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Case Pack Qty Attribute */}
                                            <div className="flex w-full items-center py-4 bg-white">
                                                <div className="w-1/3 text-xs font-semibold text-gray-600 px-6">Case Pack Qty</div>
                                                <div className="w-2/3 px-6">
                                                    {isEditing ? (
                                                        <input 
                                                            type="number"
                                                            className="w-full text-xs text-gray-700 border-b border-gray-200 focus:border-blue-400 focus:outline-none py-1"
                                                            value={product.case_pack_qty}
                                                            onChange={(e) => setProduct({...product, case_pack_qty: parseInt(e.target.value)})}
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-700 font-medium">{product.case_pack_qty} units</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex w-full items-center py-4 bg-white">
                                                <div className="w-1/3 text-xs font-semibold text-gray-600 px-6">Is Bundle</div>
                                                <div className="w-2/3 px-6">
                                                    {isEditing ? (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setProduct({...product, is_bundle: !product.is_bundle})}
                                                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${product.is_bundle ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                        >
                                                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${product.is_bundle ? 'translate-x-6' : 'translate-x-1'}`} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded uppercase tracking-tighter">
                                                            {product.is_bundle ? "YES" : "NO"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 italic">
                            Loading product information...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ProductDetailsPage;