import React, { useEffect, useState, useCallback, useMemo } from 'react';
// Remove ProductList import, we'll render products directly
// import ProductList from '../components/ProductList';
import { getStallDetails, recordTransaction, auth, signOut, getSalesForStall } from '../services/firebase'; // Import recordTransaction
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

    const fetchStallDataAndSales = useCallback(async (pin, skipResetCart = false) => {
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
        
        // Only reset cart if not skipped (for initial load, but not after transaction)
        if (!skipResetCart) {
            setCartItems({});
            setPaymentMethod('Card');
            setCashReceived('');
            setTransactionFeedback('');
        }
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
                    // Re-fetch stall data to update stock counts immediately
                    fetchStallDataAndSales(enteredPin, true);
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
        return <div className="flex-center min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200"><div className="text-xl text-light-text dark:text-dark-text">Loading Stall Details...</div></div>;
    }

    if (error) {
        return (
            <div className="flex-center min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
                <div className="bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border shadow-light dark:shadow-dark text-center p-6 transition-colors duration-200">
                    {/* Ensure error is always a string */}
                    <p className="text-red-600 dark:text-red-400 mb-4">Error: {typeof error === 'string' ? error : 'An error occurred'}</p>
                    <button
                        onClick={() => history.push('/seller-login')}
                        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }
    
    if (!stall) {
        return <div className="flex-center min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200"><div className="text-xl text-light-text dark:text-dark-text">Stall data unavailable.</div></div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-200">
            <Header handleLogout={handleLogout} />
            
            {/* Main Content with Background */}
            <div className="flex-grow relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-bg dark:to-primary-950"></div>
                
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 dark:bg-primary-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-300 dark:bg-primary-700 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                
                <div className="relative p-4 md:p-8 flex flex-col items-center">
                    {/* Main Card */}
                    <div className="bg-white dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-2xl rounded-2xl w-full max-w-5xl p-6 md:p-8 mb-6 animate-fade-in-up">
                        {/* Header Section */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mb-4 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">Your Stall: {stall?.name || 'Loading...'}</h1>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">Manage your products and process transactions</p>
                        </div>

                        {/* Transaction Feedback Area */}
                        {typeof transactionFeedback === 'string' && transactionFeedback && (
                            <div className={`mb-6 p-4 rounded-xl text-center font-medium flex items-center justify-center ${transactionFeedback.startsWith('Failed') || transactionFeedback.startsWith('Cart is empty') || transactionFeedback.startsWith('Cannot add') || transactionFeedback.startsWith('Cash received') ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={transactionFeedback.includes('successful') ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                </svg>
                                {transactionFeedback}
                            </div>
                        )}


                        {/* Product Listing & Cart Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                            {/* Products Section */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Products</h2>
                                </div>
                                <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {(stall.products || []).map((product) => {
                                const quantityInCart = cartItems[product.id] || 0;
                                const isOutOfStock = product.stockCount !== null && product.stockCount !== undefined && product.stockCount <= 0;
                                const canAddMore = !isOutOfStock && (product.stockCount === null || product.stockCount === undefined || quantityInCart < product.stockCount);

                                return (
                                    <li key={product.id} className={`bg-light-card dark:bg-dark-card backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${isOutOfStock && quantityInCart === 0 ? 'opacity-60' : ''}`}>
                                        <div className="flex flex-col space-y-4">
                                            {/* Product Name and Stock - Row 1 */}
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-lg text-light-text dark:text-dark-text">{product.name}</h4>
                                                {/* Stock Info */}
                                                {product.stockCount !== null && product.stockCount !== undefined ? (
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isOutOfStock ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        {isOutOfStock ? 'Out of Stock' : `${product.stockCount} in stock`}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                        Unlimited stock
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Price - Row 2 */}
                                            <div>
                                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">£{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
                                            </div>
                                            
                                            {/* Quantity Controls - Row 3 */}
                                            <div className="flex items-center justify-between">
                                                <button
                                                onClick={() => handleQuantityChange(product.id, -1)}
                                                className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                disabled={quantityInCart === 0}
                                                aria-label={`Decrease quantity of ${product.name}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                </svg>
                                                <span className="text-sm">Remove</span>
                                                </button>
                                                <span className="font-bold text-2xl w-16 text-center text-light-text dark:text-dark-text">{quantityInCart}</span>
                                                <button
                                                onClick={() => handleQuantityChange(product.id, 1)}
                                                className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                disabled={!canAddMore}
                                                aria-label={`Increase quantity of ${product.name}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="text-sm">Add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                            {/* Cart & Transaction Section */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Current Transaction</h2>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                    {Object.keys(cartItems).length === 0 ? (
                                        <div className="text-center py-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add products to start a transaction</p>
                                        </div>
                                    ) : (
                            <>
                                        <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                                            {Object.entries(cartItems).map(([productId, quantity]) => {
                                                const product = stall.products.find(p => p.id === productId);
                                                if (!product) return null;
                                                return (
                                                    <li key={productId} className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-light-text dark:text-dark-text">{product.name}</span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">× {quantity}</span>
                                                        </div>
                                                        <span className="font-bold text-lg text-primary-600 dark:text-primary-400">£{(product.price * quantity).toFixed(2)}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                                <div className="text-light-text dark:text-dark-text">
                                                    <span className="text-sm">Total Amount</span>
                                                    <div className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400">£{cartTotal.toFixed(2)}</div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        navigator.clipboard.writeText(cartTotal.toFixed(2));
                                                        const targetElement = e.currentTarget;
                                                        const textSpan = targetElement.querySelector('.copy-text');
                                                        const iconSvg = targetElement.querySelector('.copy-icon');
                                                        const checkSvg = targetElement.querySelector('.check-icon');
                                                        
                                                        textSpan.textContent = 'Copied!';
                                                        iconSvg.classList.add('hidden');
                                                        checkSvg.classList.remove('hidden');
                                                        
                                                        setTimeout(() => {
                                                            textSpan.textContent = 'Copy Amount';
                                                            iconSvg.classList.remove('hidden');
                                                            checkSvg.classList.add('hidden');
                                                        }, 1500);
                                                    }}
                                                    title="Copy amount to clipboard"
                                                    className="flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 check-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="copy-text">Copy Amount</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium mb-3 text-light-text dark:text-dark-text">Payment Method</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'Card' ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200' : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                                    <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => { setPaymentMethod(e.target.value); setCashReceived(''); }} className="sr-only"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    <span className="font-medium">Card</span>
                                                </label>
                                                <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'Cash' ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200' : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                                    <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only"/>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a4 4 0 00-8 0v2m-2 0h12M5 21h14l-1-12H6L5 21z" />
                                                    </svg>
                                                    <span className="font-medium">Cash</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Cash Payment Section */}
                                        {paymentMethod === 'Cash' && (
                                            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <label htmlFor="cashReceived" className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Cash Received</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        id="cashReceived"
                                                        value={cashReceived}
                                                        onChange={(e) => setCashReceived(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full px-4 py-3 text-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-light-text dark:text-dark-text"
                                                        min={cartTotal.toFixed(2)}
                                                        step="0.01"
                                                    />
                                                </div>
                                                {parseFloat(cashReceived) >= cartTotal && (
                                                    <div className="mt-3 p-3 bg-green-100 dark:bg-green-800 rounded-lg border border-green-300 dark:border-green-700">
                                                        <p className="text-green-700 dark:text-green-400 font-semibold text-lg md:text-xl flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Change Due: £{changeDue.toFixed(2)}
                                                        </p>
                                                    </div>
                                                )}
                                                {cashReceived && parseFloat(cashReceived) < cartTotal && (
                                                    <p className="text-sm mt-2 text-red-600 dark:text-red-400 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Amount is less than total
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleCompleteTransaction}
                                                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center"
                                                disabled={loading || Object.keys(cartItems).length === 0 || (paymentMethod === 'Cash' && (isNaN(parseFloat(cashReceived)) || parseFloat(cashReceived) < cartTotal))}
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Complete Sale
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={clearCart}
                                                className="px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition-colors duration-200"
                                                disabled={loading || Object.keys(cartItems).length === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                                </div>
                            </div>
                        </div> {/* End Grid */}
                    </div> {/* End Main Content Card */}


                    {/* Recent Sales Section */}
                    <div className="bg-white dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-2xl rounded-2xl w-full max-w-5xl p-6 md:p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text">Recent Sales</h3>
                        </div>
                        {loadingSales ? (
                            <div className="flex items-center justify-center py-8">
                                <svg className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : Array.isArray(stallSales) && stallSales.length > 0 ? (
                            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                         {stallSales.map(sale => {
                             // ... existing recent sales rendering logic ...
                                if (!sale || !sale.id) return null;

                                const productName = getProductName(sale.productId);
                                const formattedTimestamp = formatTimestamp(sale.timestamp);
                                const quantity = sale.quantity || 1;
                                const totalPrice = sale.totalPrice || 0;
                                const payment = sale.paymentMethod || 'N/A'; // Display payment method

                                return (
                                    <li key={sale.id} className="p-4 bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border hover:shadow-md transition-all duration-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-light-text dark:text-dark-text">
                                                    {typeof productName === 'string' ? productName : 'Invalid Product'}
                                                </h4>
                                                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        Quantity: {typeof quantity === 'number' ? quantity : 'N/A'}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    <span className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        {payment}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {typeof formattedTimestamp === 'string' ? formattedTimestamp : 'Invalid Date'}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    £{typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400">No sales recorded yet</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Your sales will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
        </div> // End Page Container
    );
};

export default SellerPage;