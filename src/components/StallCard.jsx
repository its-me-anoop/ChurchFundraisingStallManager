import React from 'react';

const StallCard = ({ stall, onRecordSale }) => {
    return (
        // Apply the glass-card style
        <div className="glass-card m-2 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{stall.name}</h2>
            <p className="text-vision-text-secondary mb-3">Seller: {stall.seller}</p>
            <h3 className="text-lg font-medium mb-2">Products:</h3>
            <ul className="list-disc list-inside space-y-2 flex-grow">
                {stall.products.map((product) => (
                    <li key={product.id} className="text-vision-text flex justify-between items-center">
                        <span>{product.name} - ${product.price}</span>
                        {/* Use updated button styles */}
                        <button
                            className="ml-3 text-sm py-1 px-3" // Adjusted padding/size
                            onClick={() => onRecordSale(product.id)}
                        >
                            Sold
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StallCard;