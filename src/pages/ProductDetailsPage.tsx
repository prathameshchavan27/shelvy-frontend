import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/product';

interface Product {
    id: number;
    name: string;
    sku: string;
    description: string;
    is_bundle: boolean;
    upc?: string; 
    imageUrl?: string; 
}

// Define the structure for dynamic attributes (simulating a future API response)
interface Attribute {
    id: number;
    name: string;
    value: string;
}

const dummyAttributes: Attribute[] = [
    { id: 101, name: "Weight", value: "1.5 kg" },
    { id: 102, name: "Color", value: "Brown" },
    { id: 103, name: "Vendor", value: "Global Beans Co." },
    { id: 104, name: "Category", value: "Beverages" },
];


const ProductDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>();
    // State to hold dynamic attributes
    const [attributes, setAttributes] = useState<Attribute[]>([]); 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response: Product = await getProductById(Number(id));
                // Add dummy data for visual demonstration
                setProduct({
                    ...response,
                    upc: '012345678905',
                    imageUrl: 'https://via.placeholder.com/300x300?text=Product+Image',
                });
                // Load dummy attributes for the specification section
                setAttributes(dummyAttributes);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    // Helper for core details (SKU, UPC) - remains the same
    const renderDetailRow = (label: string, value: string | undefined) => (
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-semibold text-gray-600 w-1/3 flex-shrink-0">{label}:</span>
            <span className="text-sm text-gray-800 w-2/3 text-right">{value || 'N/A'}</span>
        </div>
    );

    // Component for a single editable-style attribute row
    const EditableAttributeRow: React.FC<{ attribute: Attribute }> = ({ attribute }) => (
        <div className="flex w-full py-2 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition duration-100">
            {/* Attribute Name (30% width) - The future edit button could go here */}
            <div className="w-1/3 text-sm font-medium text-gray-600 px-2 truncate">
                {attribute.name}
            </div>
            {/* Attribute Value (70% width) */}
            <div className="w-2/3 text-sm text-gray-800 px-2">
                {attribute.value}
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 my-4">

            {/* Note: Header/Navbar removed for brevity, focusing on the core structure changes */}
            {/* <div className="p-6 max-w-7xl mx-auto"> */}
                <div className="h-full min-h-100 bg-white shadow-xl rounded-md overflow-hidden border border-gray-200">

                    {product ? (
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">

                                {/* Left Column: 30% - Image, UPC, Core Details (Unchanged) */}
                                <div className="md:w-3/12 space-y-4 border-r pr-4">
                                    <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                                    
                                    {/* Product Image */}
                                    <div className="p-2 border border-gray-200 rounded-lg bg-gray-50">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            className="w-full h-auto object-cover rounded" 
                                        />
                                    </div>
                                    
                                    {/* UPC and SKU details */}
                                    <div className="p-4 bg-gray-100 rounded-lg space-y-3">
                                        {renderDetailRow("SKU", product.sku)}
                                        {renderDetailRow("UPC", product.upc)}
                                        {renderDetailRow("Bundle", product.is_bundle ? "Yes" : "No")}
                                    </div>
                                </div>

                                {/* Right Column: 70% - Other Attributes (Modified) */}
                                <div className="md:w-9/12 space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Description & Attributes</h3>
                                    
                                    {/* Description Block (Unchanged) */}
                                    <div className="bg-white p-4 border rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-600 mb-2">Description:</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                                    </div>

                                    {/* Dynamic Attributes/Specifications Block (Refactored) */}
                                    <div className="bg-white border rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-700 p-4 border-b">Specifications</h4>
                                        
                                        {/* Table Header Row */}
                                        <div className="flex w-full bg-gray-100 font-bold text-xs uppercase text-gray-600 border-b">
                                            <div className="w-1/3 p-2">Attribute</div>
                                            <div className="w-2/3 p-2">Value</div>
                                        </div>

                                        {/* Attribute Rows */}
                                        <div className="divide-y divide-gray-200">
                                            {/* Core property from product interface displayed here for completeness */}
                                            <EditableAttributeRow 
                                                attribute={{ id: 99, name: "Is Bundle", value: product.is_bundle ? "Yes" : "No" }} 
                                            />
                                            
                                            {attributes.map(attr => (
                                                <EditableAttributeRow key={attr.id} attribute={attr} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">Loading product details...</div>
                    )}
                </div>
            {/* </div> */}
        </div>
    );
}

export default ProductDetailsPage;