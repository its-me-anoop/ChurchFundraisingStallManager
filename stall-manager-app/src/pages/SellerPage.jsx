import React, { useEffect, useState, useCallback } from 'react';
import ProductList from '../components/ProductList';
import { getStallDetails, recordSale, auth, signOut, getSalesForStall } from '../services/firebase';
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

    const handleRecordSale = async (productId) => {
        if (!stall) {
            setSaleFeedback('Error: Stall data missing.');
            return;
        }

        // --- Confirmation Popup --- 
        const productName = getProductName(productId);
        const confirmed = window.confirm(`Are you sure you want to record a sale for ${productName}?`);
        if (!confirmed) {
            setSaleFeedback('Sale cancelled.');
            setTimeout(() => {
                if (isMounted.current) {
                    setSaleFeedback('');
                }
            }, 2000); // Clear feedback
            return; // Stop if user cancels
        }
        // --- End Confirmation --- 

        setSaleFeedback('Recording sale...');
        try {
            await recordSale(stall.id, productId, 1);
            if (isMounted.current) {
                // Simplify the success message
                setSaleFeedback('Sale recorded successfully! Great job!'); 
            
                // Re-fetch data
                const enteredPin = sessionStorage.getItem('sellerPin');
                if (enteredPin) {
                    fetchStallDataAndSales(enteredPin);
                }
            
                // Hide feedback after a delay (Confetti timeout removed)
                setTimeout(() => {
                    if (isMounted.current) {
                        setSaleFeedback('');
                    }
                }, 5000); 
            }
        } catch (error) {
            console.error("Error recording sale from SellerPage:", error); // Log the full error object
            if (isMounted.current) {
                let errorMessage = 'An unknown error occurred.'; // Default message
                
                // Try to extract a meaningful message from the error object
                if (error && typeof error.message === 'string' && error.message.trim() !== '') {
                    errorMessage = error.message;
                } else if (typeof error === 'string' && error.trim() !== '') {
                    errorMessage = error;
                } else {
                    // Fallback: Stringify the error if possible, otherwise use the default
                    try {
                        const errorString = JSON.stringify(error);
                        if (errorString !== '{}') { // Avoid empty object stringification
                            errorMessage = errorString;
                        } 
                    } catch { /* Ignore stringify errors */ }
                }
                
                // Update the UI with the detailed error message
                setSaleFeedback(`Failed to record sale: ${errorMessage}`);
                
                // Keep the error message visible for longer (e.g., 10 seconds)
                setTimeout(() => {
                    if (isMounted.current) {
                        setSaleFeedback('');
                    }
                }, 10000); 
            }
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            sessionStorage.removeItem('sellerPin');
            history.push('/seller-login');
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
            
            <div className="glass-card w-full max-w-2xl p-6 z-10"> {/* Ensure content is above confetti */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold">Your Stall: {stall?.name || 'Loading...'}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        Logout
                    </button>
                </div>

                {typeof saleFeedback === 'string' && saleFeedback && (
                    <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${saleFeedback.startsWith('Failed') || saleFeedback.startsWith('Error') ? 'bg-red-800 bg-opacity-70 text-red-100' : 'bg-green-800 bg-opacity-70 text-green-100'}`}>
                        {saleFeedback}
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-4 border-b border-vision-border pb-2">Products</h2>
                <ProductList products={stall.products || []} onRecordSale={handleRecordSale} />

                <div className="mt-6 pt-4 border-t border-vision-border">
                    {/* --- Uncomment the sales list with added safety checks --- */}
                    <h3 className="text-xl font-semibold mb-3">Your Recent Sales:</h3>
                    {loadingSales ? (
                        <p className="text-vision-text-secondary">Loading sales...</p>
                    ) : Array.isArray(stallSales) && stallSales.length > 0 ? ( // Added Array.isArray check
                        <ul className="list-none space-y-2 max-h-60 overflow-y-auto pr-2">
                            {stallSales.map(sale => {
                                // Ensure sale and sale.id are valid before rendering
                                if (!sale || !sale.id) return null; 
                                
                                const productName = getProductName(sale.productId);
                                const formattedTimestamp = formatTimestamp(sale.timestamp);
                                const quantity = sale.quantity || 1;
                                const totalPrice = sale.totalPrice || 0;

                                return (
                                    <li key={sale.id} className="text-sm p-3 bg-black bg-opacity-20 rounded-lg">
                                        <div className="flex justify-between items-center mb-1">
                                            {/* Ensure productName is a string */}
                                            <span className="font-medium text-vision-text">{typeof productName === 'string' ? productName : 'Invalid Product'}</span>
                                            {/* Ensure totalPrice is formatted correctly */}
                                            <span className="font-semibold text-green-300">{`+£${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-vision-text-secondary">
                                            {/* Ensure quantity is a number */}
                                            <span>{`Qty: ${typeof quantity === 'number' ? quantity : 'N/A'}`}</span>
                                            {/* Ensure formattedTimestamp is a string */}
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
            </div>
        </div>
    );
};

export default SellerPage;