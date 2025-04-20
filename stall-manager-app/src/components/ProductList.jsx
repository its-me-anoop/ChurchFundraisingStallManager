import React from 'react';

const ProductList = ({ products, onRecordSale }) => {
    // Handle case where products might be undefined or not an array
    if (!Array.isArray(products) || products.length === 0) {
        return <div className="p-4 text-center text-vision-text-secondary">No products available for this stall.</div>;
    }

    return (
        // Remove outer padding if SellerPage adds it
        <div> 
            {/* Removed heading, SellerPage can have its own */}
            <ul className="space-y-3"> {/* Increased spacing */}
                {products.map((product) => {
                    // Determine if the product is out of stock
                    const isOutOfStock = product.stockCount !== null && product.stockCount !== undefined && product.stockCount <= 0;
                    
                    return (
                        // Apply glass-card styling to each product item for a distinct look
                        <li key={product.id} className={`glass-card flex justify-between items-center p-4 ${isOutOfStock ? 'opacity-60' : ''}`}> {/* Add opacity if out of stock */}
                            <div className="flex-grow mr-4"> {/* Allow text to take space */}
                                <span className="block font-medium text-vision-text">{product.name}</span>
                                {/* Format price */}
                                <span className="text-sm text-vision-text-secondary">£{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
                                {/* Display stock count or 'Out of Stock' */}
                                {product.stockCount !== null && product.stockCount !== undefined ? (
                                    <span className={`block text-xs mt-1 ${isOutOfStock ? 'text-red-400 font-semibold' : 'text-blue-400'}`}>
                                        {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stockCount}`}
                                    </span>
                                ) : (
                                    <span className="block text-xs text-gray-500 mt-1">Stock not tracked</span>
                                )}
                            </div>
                            {/* Use themed button style */}
                            <button
                                className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex-shrink-0 ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-600 hover:bg-gray-600' : ''}`} // Style disabled button
                                onClick={() => onRecordSale(product.id)}
                                disabled={isOutOfStock} // Disable button if out of stock
                            >
                                Record Sale
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ProductList;