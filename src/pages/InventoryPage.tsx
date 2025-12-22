import React, { useEffect, useState } from 'react'
import { useWarehouse } from '../context/WarehouseContext'
import { getInventoryLocationsByWarehouse } from '../api/inventory';
import LocationList from '../components/LocationList';
import List, { ListItem } from '../components/List';
import { useNavigate } from 'react-router-dom';

interface Location {
    id: number;
    storage_id: string;
    product_count: number;
    total_quantity: number;
}

const InventoryPage: React.FC = () => {
    const { warehouseId } = useWarehouse();
    console.log("Selected Warehouse ID:", warehouseId);
    const [locations, setLocations] = useState<Location[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchLocations = async () => {
            const res = await getInventoryLocationsByWarehouse(warehouseId);
            setLocations(res.locations);
        }
        fetchLocations();
      }, [warehouseId]);

      const handleViewItem = (item: ListItem) => {
        // Cast the generic ListItem back to the specific Location interface
        const location = item as Location; 
        navigate(`/inventory/${location.id}`);
    };
  return (
      <div>
          <ul>
              {/* <LocationList locations={locations} onView={handleViewLocation} /> */}
              <List
                  items={locations as ListItem[]}
                    onView={handleViewItem}
                    getTitle={(item) => `${(item as Location).storage_id}`}
                    getDetails={(item) => `${(item as Location).product_count} | ${(item as Location).total_quantity}`}
                    columnHeadings={{
                        title: "Storage ID",
                        details: "Product | Units",
                    }}
              />
          </ul>
      </div>
  )
}

export default InventoryPage