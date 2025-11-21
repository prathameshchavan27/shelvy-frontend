import React, { useEffect } from 'react'
import { getProducts } from '../api/product';
import { useNavigate } from 'react-router-dom';
import List from '../components/List';

const ProductPage = () => {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            console.log("Products:", data);
            setProducts(data);
        };
        fetchProducts();
    }, []);
  return (
    <div className="w-full bg-white my-2 shadow-sm p-4 ">
      {/* <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-3 px-3 font-semibold text-gray-700">
              Product
            </th>
            <th className="text-left py-3 px-3 font-semibold text-gray-700 ">
              Details
            </th>
          </tr>
        </thead>

        <tbody>
            {products.map((product:any) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition p-4">
                    <td className="py-3 px-3 text-gray-800">{product.name}</td>
                    <tr>
                        <td className="py-1 px-3 text-gray-600 text-xs">SKU: {product.sku}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-3 text-gray-600 text-xs">Info: {product.description?.length > 20
                            ? product.description.substring(0, 20) + "..."
                            : product.description}
                        </td>
                    </tr>
                    <td className='text-center w-1/12' onClick={() => {navigate(`/products/${product.id}`)}}><span className='border px-4 py-2 rounded-full'> View </span></td>
                </tr>
            ))}
        </tbody>
      </table> */}
      <List
          items={products}
          onView={(item) => navigate(`/products/${item.id}`)}
          getTitle={(item) => item.name}
          getDetails={(item) => `SKU: ${item.sku}`}
          columnHeadings={{
              title: "Product",
              details: "Details",
          }}
      />
    </div>
  );
};



export default ProductPage