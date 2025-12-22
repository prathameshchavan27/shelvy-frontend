import React from "react";

interface Movement {
  quantity_moved: number;
  transfer_to: string;
  transfer_from: string;
  created_at: string;
}

interface HistoryItem {
  quantity_on_hand: number;
  reserved_quantity: number;
  status: string;
  created_at: string;
  movement?: Movement;
}


interface Props {
  productName: string;
  sku: string;
  history: HistoryItem[];
  location: string;
}

interface ListProps {
  products: Props[];
}

const InventoryMovementList: React.FC<ListProps> = ({ products }) => {
  return (
    <div>
      {products.map((product, idx) => {
        const movementHistory = product.history.filter((h) => h.movement != null);
        if (movementHistory.length === 0) return null;
        return (
          <div key={idx} className="mt-4 bg-white border rounded-lg shadow-sm p-4">
            {movementHistory.map((h, index) => {
              const m = h.movement!;
              let qtyChange = 0;
              if (product.location === m.transfer_from) qtyChange = -m.quantity_moved;
              if (product.location === m.transfer_to) qtyChange = +m.quantity_moved;
              return (
                <div
                  key={index}
                  className="border-b py-3 last:border-none flex justify-between items-center"
                >
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    <p className={`font-medium ${qtyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {qtyChange > 0 ? `+${qtyChange}` : qtyChange}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.location === m.transfer_from && (
                        <>transfered to <span className="font-medium font-bold text-black">{m.transfer_to}</span></>
                      )}
                      {product.location === m.transfer_to && (
                        <>transfered from <span className="font-medium">{m.transfer_from}</span></>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(h.created_at).toLocaleString()}
                    </p>
                  {/* </div> */}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default InventoryMovementList;
