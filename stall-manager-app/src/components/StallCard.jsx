import React from 'react';

const StallCard = ({ stall, onRecordSale }) => {
    return (
        <div className="border rounded-lg p-4 m-2 shadow-md">
            <h2 className="text-xl font-bold">{stall.name}</h2>
            <p className="text-gray-700">Seller: {stall.seller}</p>
            <h3 className="text-lg font-semibold">Products:</h3>
            <ul className="list-disc pl-5">
                {stall.products.map((product) => (
                    <li key={product.id} className="text-gray-600">
                        {product.name} - ${product.price}
                        <button 
                            className="ml-2 bg-blue-500 text-white rounded px-2 py-1"
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