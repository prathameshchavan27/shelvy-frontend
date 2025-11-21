import React, { useEffect, useState } from 'react'
import { useWarehouse } from '../context/WarehouseContext'
import { getInventoryLocationsByWarehouse } from '../api/inventory';
import LocationList from '../components/LocationList';
import List, { ListItem } from '../components/List';

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
        
        console.log(`Viewing Location ID: ${location.id}, Storage ID: ${location.storage_id}`);
        // NOTE: Avoid using alert() in final apps. Using it here to match previous behavior.
        alert(`Navigating to details for Location ID: ${location.id}, Storage ID: ${location.storage_id}`);
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