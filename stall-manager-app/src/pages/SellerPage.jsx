import React, { useEffect, useState, useCallback, useMemo } from 'react';
// Remove ProductList import, we'll render products directly
// import ProductList from '../components/ProductList';
import { getStallDetails, recordTransaction, auth, signOut, getSalesForStall } from '../services/firebase'; // Import recordTransaction
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const SellerPage = () => {
    const [stall, setStall] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const history = useHistory();
    const [saleFeedback, setSaleFeedback] = useState('');
    const [stallSales, setStallSales] = useState([]);
    const [loadingSales, setLoadingSales] = useState(false);
    const [cartItems, setCartItems] = useState({}); // { productId: quantity }
    const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card' or 'Cash'
    const [cashReceived, setCashReceived] = useState('');
    const [transactionFeedback, setTransactionFeedback] = useState(''); // Separate feedback for transaction completion

    // Add cleanup flag to prevent state updates after unmounting
    const isMounted = React.useRef(true);
    
    // Set up cleanup when component unmounts
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchStallDataAndSales = useCallback(async (pin) => {
        setLoading(true);
        setLoadingSales(true);
        setError('');
        try {
            const stallData = await getStallDetails(pin);
            if (stallData) {
                setStall(stallData);
                const salesData = await getSalesForStall(stallData.id);
                setStallSales(salesData.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0)));
            } else {
                setError('Invalid PIN or stall not found. Please try again.');
                await signOut(auth);
                sessionStorage.removeItem('sellerPin');
                history.push('/seller-login');
            }
        } catch (err) {
            console.error("Error fetching stall details or sales:", err);
            setError('Failed to fetch stall details or sales.');
            if (stall === null) {
                await signOut(auth);
                sessionStorage.removeItem('sellerPin');
                history.push('/seller-login');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setLoadingSales(false);
            }
        }
        // Reset cart when fetching new data
        setCartItems({});
        setPaymentMethod('Card');
        setCashReceived('');
        setTransactionFeedback('');
    }, [history]);

    useEffect(() => {
        const enteredPin = sessionStorage.getItem('sellerPin');

        if (!currentUser) {
            setError('Authentication required.');
            setLoading(false);
            history.push('/seller-login');
            return;
        }

        if (!enteredPin) {
            setError('PIN not provided. Please log in again.');
            setLoading(false);
            signOut(auth).catch(err => console.error("Sign out failed:", err));
            sessionStorage.removeItem('sellerPin');
            history.push('/seller-login');
            return;
        }

        fetchStallDataAndSales(enteredPin);

    }, [currentUser, history, fetchStallDataAndSales]);

    const handleQuantityChange = (productId, delta) => {
        setCartItems(prevCart => {
            const currentQuantity = prevCart[productId] || 0;
            const newQuantity = Math.max(0, currentQuantity + delta); // Ensure quantity doesn't go below 0

            const product = stall?.products?.find(p => p.id === productId);
            const stock = product?.stockCount;

            // Prevent adding more than available stock if stock is tracked
            if (stock !== null && stock !== undefined && newQuantity > stock) {
                setTransactionFeedback(`Cannot add more than available stock (${stock}) for ${product.name}.`);
                setTimeout(() => setTransactionFeedback(''), 3000); // Clear feedback
                return prevCart; // Return previous state if stock limit reached
            }


            if (newQuantity === 0) {
                // Remove item from cart if quantity is zero
                const { [productId]: _, ...rest } = prevCart;
                return rest;
            } else {
                return { ...prevCart, [productId]: newQuantity };
            }
        });
         // Clear feedback when quantity changes
        setTransactionFeedback('');
    };

    const clearCart = () => {
        setCartItems({});
        setPaymentMethod('Card');
        setCashReceived('');
        setTransactionFeedback('');
    };

    // --- Calculate Cart Total ---
    const cartTotal = useMemo(() => {
        return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
            const product = stall?.products?.find(p => p.id === productId);
            return total + (product?.price || 0) * quantity;
        }, 0);
    }, [cartItems, stall?.products]);

    // --- Calculate Change ---
    const changeDue = useMemo(() => {
        if (paymentMethod !== 'Cash' || !cashReceived) return 0;
        const received = parseFloat(cashReceived);
        return Math.max(0, received - cartTotal); // Ensure change is not negative
    }, [cashReceived, cartTotal, paymentMethod]);


    // --- Handle Transaction Completion ---
    const handleCompleteTransaction = async () => {
        if (Object.keys(cartItems).length === 0) {
            setTransactionFeedback('Cart is empty.');
            setTimeout(() => setTransactionFeedback(''), 3000);
            return;
        }
        if (paymentMethod === 'Cash' && (isNaN(parseFloat(cashReceived)) || parseFloat(cashReceived) < cartTotal)) {
             setTransactionFeedback('Cash received is less than the total amount or invalid.');
             setTimeout(() => setTransactionFeedback(''), 4000);
             return;
        }


        setTransactionFeedback('Processing transaction...');
        setLoading(true); // Use main loading indicator

        const itemsToRecord = Object.entries(cartItems).map(([productId, quantity]) => ({
            productId,
            quantity,
            // Find product details again to ensure consistency, though already used for total
            pricePerItem: stall?.products?.find(p => p.id === productId)?.price || 0
        }));

        try {
            await recordTransaction(stall.id, itemsToRecord, paymentMethod);

            if (isMounted.current) {
                setTransactionFeedback(`Transaction successful (${paymentMethod})! Total: £${cartTotal.toFixed(2)}.`);
                clearCart(); // Clear cart on success

                // Re-fetch sales data to show updated list
                const enteredPin = sessionStorage.getItem('sellerPin');
                 if (enteredPin) {
                    // Only fetch sales, not full stall details unless stock needs refresh visually immediately
                    setLoadingSales(true);
                    getSalesForStall(stall.id)
                        .then(salesData => {
                             if (isMounted.current) {
                                setStallSales(salesData.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0)));
                             }
                        })
                        .catch(err => {
                            console.error("Error fetching sales after transaction:", err);
                            // Optionally set an error state here
                        })
                        .finally(() => {
                             if (isMounted.current) setLoadingSales(false);
                        });
                    // OPTIONAL: Re-fetch stall data if you need to show updated stock counts immediately
                    // fetchStallDataAndSales(enteredPin);
                 }

                setTimeout(() => {
                    if (isMounted.current) setTransactionFeedback('');
                }, 5000); // Keep success message longer
            }
        } catch (error) {
            console.error("Error completing transaction:", error);
            if (isMounted.current) {
                setTransactionFeedback(`Transaction failed: ${error.message || 'Unknown error'}`);
                // Don't clear cart on failure
                 setTimeout(() => { // Keep error message longer
                    if (isMounted.current) setTransactionFeedback('');
                }, 10000);
            }
        } finally {
             if (isMounted.current) setLoading(false); // Stop loading indicator
        }
    };


    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            sessionStorage.removeItem('sellerPin');
            history.push('/'); // Redirect to home page
        } catch (error) {
            console.error("Seller Logout Error:", error);
            setError("Failed to log out. Please try again.");
            setLoading(false);
        }
    };

    const getProductName = (productId) => {
        if (!stall || !stall.products) return 'Unknown Product';
        const product = stall.products.find(p => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.toDate) return 'N/A';
        try {
            return timestamp.toDate().toLocaleString();
        } catch (error) {
            console.error("Error formatting timestamp:", error);
            return 'Invalid Date';
        }
    };

    if (loading && !stall) {
        return <div className="flex-center min-h-screen"><div className="text-xl">Loading Stall Details...</div></div>;
    }

    if (error) {
        return (
            <div className="flex-center min-h-screen">
                <div className="glass-card text-center p-6">
                    {/* Ensure error is always a string */}
                    <p className="text-red-400 mb-4">Error: {typeof error === 'string' ? error : 'An error occurred'}</p>
                    <button
                        onClick={() => history.push('/seller-login')}
                        className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }
    
    if (!stall) {
        return <div className="flex-center min-h-screen"><div className="text-xl">Stall data unavailable.</div></div>;
    }

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative">
            <div className="glass-card w-full max-w-4xl p-6 z-10 mb-6"> {/* Wider card */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold">Your Stall: {stall?.name || 'Loading...'}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Transaction Feedback Area */}
                 {typeof transactionFeedback === 'string' && transactionFeedback && (
                    <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${transactionFeedback.startsWith('Failed') || transactionFeedback.startsWith('Cart is empty') || transactionFeedback.startsWith('Cannot add') || transactionFeedback.startsWith('Cash received') ? 'bg-red-800 bg-opacity-70 text-red-100' : 'bg-green-800 bg-opacity-70 text-green-100'}`}>
                        {transactionFeedback}
                    </div>
                )}


                {/* Product Listing & Cart Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Products Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b border-vision-border pb-2">Products</h2>
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2"> {/* Scrollable product list */}
                            {(stall.products || []).map((product) => {
                                const quantityInCart = cartItems[product.id] || 0;
                                const isOutOfStock = product.stockCount !== null && product.stockCount !== undefined && product.stockCount <= 0;
                                const canAddMore = !isOutOfStock && (product.stockCount === null || product.stockCount === undefined || quantityInCart < product.stockCount);

                                return (
                                    <li key={product.id} className={`glass-card flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 ${isOutOfStock && quantityInCart === 0 ? 'opacity-60' : ''}`}>
                                        <div className="flex-grow mb-2 sm:mb-0 sm:mr-4">
                                            <span className="block font-medium text-vision-text">{product.name}</span>
                                            <span className="text-sm text-vision-text-secondary">£{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
                                            {/* Stock Info */}
                                            {product.stockCount !== null && product.stockCount !== undefined ? (
                                                <span className={`block text-xs mt-1 ${isOutOfStock ? 'text-red-400 font-semibold' : 'text-blue-400'}`}>
                                                    {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stockCount}`}
                                                </span>
                                            ) : (
                                                <span className="block text-xs text-gray-500 mt-1">Stock not tracked</span>
                                            )}
                                        </div>
                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                             <button
                                                onClick={() => handleQuantityChange(product.id, -1)}
                                                className={`bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
                                                disabled={quantityInCart === 0}
                                                aria-label={`Decrease quantity of ${product.name}`}
                                            >
                                                -
                                            </button>
                                            <span className="font-semibold w-8 text-center">{quantityInCart}</span>
                                            <button
                                                onClick={() => handleQuantityChange(product.id, 1)}
                                                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
                                                disabled={!canAddMore}
                                                 aria-label={`Increase quantity of ${product.name}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Cart & Transaction Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b border-vision-border pb-2">Current Transaction</h2>
                        {Object.keys(cartItems).length === 0 ? (
                            <p className="italic text-sm text-vision-text-secondary">Cart is empty. Add products using the controls on the left.</p>
                        ) : (
                            <>
                                <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                                    {Object.entries(cartItems).map(([productId, quantity]) => {
                                        const product = stall.products.find(p => p.id === productId);
                                        if (!product) return null; // Should not happen if cart is managed correctly
                                        return (
                                            <li key={productId} className="text-sm flex justify-between items-center p-2 bg-black bg-opacity-10 rounded">
                                                <span>{product.name} x {quantity}</span>
                                                <span className="font-medium">£{(product.price * quantity).toFixed(2)}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="text-lg font-bold mb-4 border-t border-vision-border pt-3">
                                    Total: £{cartTotal.toFixed(2)}
                                </div>

                                {/* Payment Method */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Payment Method:</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => { setPaymentMethod(e.target.value); setCashReceived(''); }} className="mr-2"/> Card
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2"/> Cash
                                        </label>
                                    </div>
                                </div>

                                {/* Cash Payment Section */}
                                {paymentMethod === 'Cash' && (
                                    <div className="mb-4 p-3 bg-black bg-opacity-10 rounded">
                                        <label htmlFor="cashReceived" className="block text-sm font-medium mb-1">Cash Received (£):</label>
                                        <input
                                            type="number"
                                            id="cashReceived"
                                            value={cashReceived}
                                            onChange={(e) => setCashReceived(e.target.value)}
                                            placeholder="e.g., 20.00"
                                            className="w-full p-2 rounded bg-white bg-opacity-10 border border-vision-border focus:ring-2 focus:ring-vision-accent focus:outline-none"
                                            min={cartTotal.toFixed(2)} // Suggest minimum amount
                                            step="0.01"
                                        />
                                        {parseFloat(cashReceived) >= cartTotal && (
                                            <p className="text-sm mt-2 text-green-300">Change Due: £{changeDue.toFixed(2)}</p>
                                        )}
                                         {cashReceived && parseFloat(cashReceived) < cartTotal && (
                                            <p className="text-sm mt-2 text-red-400">Amount is less than total.</p>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCompleteTransaction}
                                        className="flex-grow bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={loading || Object.keys(cartItems).length === 0 || (paymentMethod === 'Cash' && (isNaN(parseFloat(cashReceived)) || parseFloat(cashReceived) < cartTotal))}
                                    >
                                        {loading ? 'Processing...' : `Complete Sale (${paymentMethod})`}
                                    </button>
                                     <button
                                        onClick={clearCart}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                        disabled={loading || Object.keys(cartItems).length === 0}
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div> {/* End Grid */}
            </div> {/* End Main Content Card */}


             {/* Recent Sales Section (Below main card) */}
            <div className="glass-card w-full max-w-4xl p-6 z-10 mt-0"> {/* Use mt-0 if gap is already provided by flex parent */}
                 <h3 className="text-xl font-semibold mb-3 border-b border-vision-border pb-2">Your Recent Sales:</h3>
                 {loadingSales ? (
                     <p className="text-vision-text-secondary">Loading sales...</p>
                 ) : Array.isArray(stallSales) && stallSales.length > 0 ? (
                     <ul className="list-none space-y-2 max-h-60 overflow-y-auto pr-2">
                         {stallSales.map(sale => {
                             // ... existing recent sales rendering logic ...
                                if (!sale || !sale.id) return null;

                                const productName = getProductName(sale.productId);
                                const formattedTimestamp = formatTimestamp(sale.timestamp);
                                const quantity = sale.quantity || 1;
                                const totalPrice = sale.totalPrice || 0;
                                const payment = sale.paymentMethod || 'N/A'; // Display payment method

                                return (
                                    <li key={sale.id} className="text-sm p-3 bg-black bg-opacity-20 rounded-lg">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-vision-text">{typeof productName === 'string' ? productName : 'Invalid Product'} (x{typeof quantity === 'number' ? quantity : 'N/A'})</span>
                                            <span className="font-semibold text-green-300">{`+£${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-vision-text-secondary">
                                            <span>{`Paid via: ${payment}`}</span>
                                            <span>{typeof formattedTimestamp === 'string' ? formattedTimestamp : 'Invalid Date'}</span>
                                        </div>
                                    </li>
                                );
                         })}
                     </ul>
                 ) : (
                     <p className="italic text-sm text-vision-text-secondary">You haven't recorded any sales yet.</p>
                 )}
            </div>


        </div> // End Page Container
    );
};

export default SellerPage;