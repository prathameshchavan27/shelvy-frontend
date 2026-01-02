import React, { useEffect } from 'react'
import { getProducts } from '../api/product';
import { useNavigate } from 'react-router-dom';
import List from '../components/List';
import AddProductFeature from '../components/AddProductModal';

const ProductPage = () => {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
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
      {role!='staff' && <AddProductFeature />}
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