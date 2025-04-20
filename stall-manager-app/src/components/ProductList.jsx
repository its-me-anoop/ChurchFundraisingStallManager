import React from 'react';

const ProductList = ({ products, onRecordSale }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Products Available</h2>
            <ul className="space-y-2">
                {products.map((product) => (
                    <li key={product.id} className="flex justify-between items-center border p-2 rounded">
                        <span>{product.name} - ${product.price}</span>
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
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

export default ProductList;