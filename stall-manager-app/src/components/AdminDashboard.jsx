import React, { useState, useEffect } from 'react';
import { firestore, getSalesForStall } from '../services/firebase'; // Import getSalesForStall
// Import collection, getDocs, query for fetching all sales
import { collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion, getDocs, query as firestoreQuery } from 'firebase/firestore';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import LoadingSpinner from './LoadingSpinner';

const AdminDashboard = ({ handleLogout }) => {
    const [stalls, setStalls] = useState([]);
    const [stallName, setStallName] = useState('');
    const [productNameMap, setProductNameMap] = useState({}); // Use a map for product names per stall
    const [productPriceMap, setProductPriceMap] = useState({}); // Added for price
    const [productStockMap, setProductStockMap] = useState({}); // Added for stock
    const [sellerPinMap, setSellerPinMap] = useState({}); // Use a map for seller PINs per stall
    const [stallSales, setStallSales] = useState({}); // State to hold sales data per stall
    const [loadingSales, setLoadingSales] = useState(false); // Loading state for sales
    const [totalOverallSales, setTotalOverallSales] = useState(0); // State for total sales across all stalls

    useEffect(() => {
        setLoadingSales(true);
        const unsubscribeStalls = onSnapshot(collection(firestore, 'stalls'), async (snapshot) => {
            const stallsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStalls(stallsData);
            
            // Initialize maps and fetch sales for each stall
            const initialProductNameMap = {};
            const initialProductPriceMap = {};
            const initialProductStockMap = {};
            const initialSellerPinMap = {};
            const salesPromises = [];
            const newStallSales = {};

            stallsData.forEach(stall => {
                initialProductNameMap[stall.id] = '';
                initialProductPriceMap[stall.id] = '';
                initialProductStockMap[stall.id] = '';
                initialSellerPinMap[stall.id] = '';
                // Fetch sales for this stall
                salesPromises.push(
                    getSalesForStall(stall.id).then(sales => {
                        // Sort sales by timestamp, newest first
                        newStallSales[stall.id] = sales.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
                    })
                );
            });

            setProductNameMap(initialProductNameMap);
            setProductPriceMap(initialProductPriceMap);
            setProductStockMap(initialProductStockMap);
            setSellerPinMap(initialSellerPinMap);

            // Wait for all sales data to be fetched
            await Promise.all(salesPromises);
            setStallSales(newStallSales);

            // Calculate total overall sales after fetching individual stall sales
            let overallTotal = 0;
            stallsData.forEach(stall => {
                const sales = newStallSales[stall.id] || [];
                overallTotal += sales.reduce((total, sale) => total + (sale.totalPrice || 0), 0);
            });
            setTotalOverallSales(overallTotal);

            setLoadingSales(false);
        });

        // Cleanup function
        return () => {
            unsubscribeStalls();
        };
    }, []);

    const handleAddStall = async (e) => {
        e.preventDefault();
        if (stallName) {
            // Use firestore directly
            await addDoc(collection(firestore, 'stalls'), { 
                name: stallName, 
                products: [], 
                sellerPin: null, 
                // Initialize totalRaised if desired, though calculating is safer
                // totalRaised: 0 
            }); 
            setStallName('');
        }
    };

    const handleAddProduct = async (stallId) => {
        const currentProductName = productNameMap[stallId];
        const currentProductPrice = productPriceMap[stallId];
        const currentProductStock = productStockMap[stallId]; // Optional stock

        // Basic validation: require name and price
        if (currentProductName && currentProductPrice) {
            const price = parseFloat(currentProductPrice);
            // Ensure price is a valid number
            if (isNaN(price) || price < 0) {
                alert("Please enter a valid positive price.");
                return;
            }

            // Ensure stock is a valid non-negative integer if provided
            let stock = null;
            if (currentProductStock) {
                stock = parseInt(currentProductStock);
                if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
                     alert("Please enter a valid whole number for stock (0 or greater), or leave it empty.");
                     return;
                }
            }

            const newProduct = {
                id: Date.now().toString(), // Simple unique ID based on timestamp
                name: currentProductName,
                price: price,
                stockCount: stock, // Can be null or a non-negative integer
            };

            const stallRef = doc(firestore, 'stalls', stallId);
            try {
                await updateDoc(stallRef, {
                    products: arrayUnion(newProduct)
                });
                // Reset inputs for this stall
                setProductNameMap(prev => ({ ...prev, [stallId]: '' }));
                setProductPriceMap(prev => ({ ...prev, [stallId]: '' }));
                setProductStockMap(prev => ({ ...prev, [stallId]: '' }));
            } catch (error) {
                console.error("Error adding product: ", error);
                alert("Failed to add product. Please try again.");
            }
        }
    };

    const handleAssignSeller = async (stallId) => {
        const currentSellerPin = sellerPinMap[stallId];
        if (currentSellerPin) {
            // Use firestore directly and v9 functions
            const stallRef = doc(firestore, 'stalls', stallId);
            await updateDoc(stallRef, { sellerPin: currentSellerPin });
            setSellerPinMap(prev => ({ ...prev, [stallId]: '' })); // Reset specific input
        }
    };

    // Helper to update input field state
    const handleInputChange = (mapSetter, id, value) => {
        mapSetter(prev => ({ ...prev, [id]: value }));
    };

    // Function to calculate total raised for a stall
    const calculateTotalRaised = (stallId) => {
        const sales = stallSales[stallId] || [];
        return sales.reduce((total, sale) => total + (sale.totalPrice || 0), 0);
    };

    // Helper to get product name from ID
    const getProductName = (stall, productId) => {
        const product = stall.products?.find(p => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    // Helper to format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.toDate) return 'N/A';
        return timestamp.toDate().toLocaleString(); // Adjust format as needed
    };

    // Function to fetch all sales data and trigger CSV download
    const exportSalesToCSV = async () => {
        setLoadingSales(true); // Indicate loading
        try {
            // 1. Fetch all stalls to map IDs to names and get product details
            const stallsSnapshot = await getDocs(collection(firestore, 'stalls'));
            const stallsMap = {};
            stallsSnapshot.forEach(doc => {
                stallsMap[doc.id] = { id: doc.id, ...doc.data() };
            });

            // 2. Fetch all sales records
            const salesSnapshot = await getDocs(firestoreQuery(collection(firestore, 'sales'))); // Use alias for query
            const allSalesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 3. Prepare CSV data
            let csvContent = "data:text/csv;charset=utf-8,";
            // Define headers
            const headers = ["Timestamp", "Stall Name", "Product Name", "Quantity", "Price Per Item (£)", "Total Price (£)"];
            csvContent += headers.join(",") + "\r\n";

            // Sort sales by timestamp (optional, but nice)
            allSalesData.sort((a, b) => (a.timestamp?.toDate() || 0) - (b.timestamp?.toDate() || 0));

            // Add rows
            allSalesData.forEach(sale => {
                const stall = stallsMap[sale.stallId];
                const stallName = stall ? stall.name : 'Unknown Stall';
                const productName = stall ? getProductName(stall, sale.productId) : 'Unknown Product';
                const timestamp = sale.timestamp ? formatTimestamp(sale.timestamp) : 'N/A';
                const pricePerItem = (sale.pricePerItem || 0).toFixed(2);
                const totalPrice = (sale.totalPrice || 0).toFixed(2);
                const quantity = sale.quantity || 1;

                // Escape commas in names if necessary (basic handling)
                const safeStallName = `"${stallName.replace(/"/g, '""')}"`;
                const safeProductName = `"${productName.replace(/"/g, '""')}"`;
                const safeTimestamp = `"${timestamp.replace(/"/g, '""')}"`;


                const row = [safeTimestamp, safeStallName, safeProductName, quantity, pricePerItem, totalPrice];
                csvContent += row.join(",") + "\r\n";
            });

            // 4. Create and trigger download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "sales_export.csv");
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Error exporting sales to CSV:", error);
            alert("Failed to export sales data. Please check the console for details.");
        } finally {
            setLoadingSales(false); // Stop loading indicator
        }
    };


    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">Admin Dashboard</h1>
                {handleLogout && (
                    <Button
                        onClick={handleLogout}
                        variant="danger"
                    >
                        Logout
                    </Button>
                )}
            </div>

            {/* Summary Section */}
            <Card
                className="mb-8"
                elevation="normal"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-medium mb-2 text-light-text dark:text-dark-text">Overall Summary</h2>
                        <p className="text-lg text-light-text dark:text-dark-text">
                            Total Sales: <span className="font-semibold text-green-600 dark:text-green-400">£{totalOverallSales.toFixed(2)}</span>
                        </p>
                    </div>
                    <Button
                        onClick={exportSalesToCSV}
                        disabled={loadingSales}
                        variant="primary"
                        className="flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {loadingSales ? 'Exporting...' : 'Export All Sales (CSV)'}
                    </Button>
                </div>
            </Card>

            {/* Add Stall Form */}
            <Card
                className="mb-8 max-w-lg mx-auto"
                title="Add New Stall"
                elevation="normal"
            >
                <form onSubmit={handleAddStall} className="flex items-center space-x-3">
                    <div className="flex-grow mb-0">
                        <Input
                            type="text"
                            value={stallName}
                            onChange={(e) => setStallName(e.target.value)}
                            placeholder="New Stall Name"
                            required
                            className="mb-0"
                        />
                    </div>
                    <Button type="submit" variant="primary">
                        Add Stall
                    </Button>
                </form>
            </Card>

            {/* Stalls Grid */}
            {loadingSales && !stalls.length ? (
                <div className="flex flex-col justify-center items-center py-12">
                    <LoadingSpinner size="large" message="Loading stall data..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stalls.map(stall => {
                        const totalRaised = calculateTotalRaised(stall.id);
                        const sales = stallSales[stall.id] || [];
                        return (
                            <Card key={stall.id} className="flex flex-col space-y-4" padding="normal" elevation="normal">
                                <div className="flex justify-between items-start border-b border-light-border dark:border-dark-border pb-3 mb-2">
                                    <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">{stall.name}</h2>
                                    {/* Display Total Raised */}
                                    <div className="text-right">
                                        <span className="block text-sm text-light-text-secondary dark:text-dark-text-secondary">Total Raised</span>
                                        <span className="block text-lg font-semibold text-green-600 dark:text-green-400">£{totalRaised.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Add Product Form */}
                                <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(stall.id); }} className="space-y-3">
                                    <Input
                                        type="text"
                                        value={productNameMap[stall.id] || ''}
                                        onChange={(e) => handleInputChange(setProductNameMap, stall.id, e.target.value)}
                                        placeholder="Product Name"
                                        required
                                    />
                                    <div className="flex space-x-3">
                                        <div className="w-1/2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={productPriceMap[stall.id] || ''}
                                                onChange={(e) => handleInputChange(setProductPriceMap, stall.id, e.target.value)}
                                                placeholder="Price (£)"
                                                required
                                                className="mb-0"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Input
                                                type="number"
                                                step="1"
                                                min="0"
                                                value={productStockMap[stall.id] || ''}
                                                onChange={(e) => handleInputChange(setProductStockMap, stall.id, e.target.value)}
                                                placeholder="Stock (Optional)"
                                                className="mb-0"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" variant="success" fullWidth>Add Product</Button>
                                </form>

                                {/* Assign Seller PIN Form */}
                                <form onSubmit={(e) => { e.preventDefault(); handleAssignSeller(stall.id); }} className="flex items-center space-x-3">
                                    <div className="flex-grow mb-0">
                                        <Input
                                            type="text"
                                            value={sellerPinMap[stall.id] || ''}
                                            onChange={(e) => handleInputChange(setSellerPinMap, stall.id, e.target.value)}
                                            placeholder="Seller PIN (4 digits)"
                                            maxLength="4"
                                            pattern="\d{4}" // Basic pattern validation
                                            title="PIN must be 4 digits"
                                            className="mb-0"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        variant="secondary"
                                    >
                                        Set PIN
                                    </Button>
                                </form>

                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    Current Seller PIN: <span className="font-medium">{stall.sellerPin || 'Not Assigned'}</span>
                                </p>

                                <div>
                                    <h3 className="text-lg font-medium mb-2 text-light-text dark:text-dark-text">Products:</h3>
                                    <ul className="list-none space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
                                        {Array.isArray(stall.products) && stall.products.length > 0 ? (
                                            stall.products.map((product) => (
                                                product && product.price !== undefined && product.price !== null ? (
                                                    <li key={product.id || product.name} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <span className="text-light-text dark:text-dark-text">{product.name || 'Unnamed Product'}</span>
                                                        <span className="font-medium text-primary-600 dark:text-primary-400">£{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
                                                        {/* Display stock count */}
                                                        {product.stockCount !== null && product.stockCount !== undefined ? (
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${product.stockCount <= 0 ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'}`}>
                                                                Stock: {product.stockCount}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs italic text-light-text-secondary dark:text-dark-text-secondary">Stock N/A</span>
                                                        )}
                                                    </li>
                                                ) : null
                                            ))
                                        ) : (
                                            <li className="italic text-xs text-light-text-secondary dark:text-dark-text-secondary p-2">No products added yet.</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Sales List Section */}
                                <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                                    <h3 className="text-lg font-medium mb-2 text-light-text dark:text-dark-text">Recent Sales:</h3>
                                    {loadingSales && !sales.length ? (
                                        <div className="flex items-center justify-center py-3">
                                            <LoadingSpinner size="small" message="Loading sales..." />
                                        </div>
                                    ) : sales.length > 0 ? (
                                        <ul className="list-none space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {sales.map(sale => (
                                                <li key={sale.id} className="text-xs p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-light-text dark:text-dark-text">{getProductName(stall, sale.productId)}</span>
                                                        <span className="font-semibold text-green-600 dark:text-green-400">+£{(sale.totalPrice || 0).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-light-text-secondary dark:text-dark-text-secondary">
                                                        <span>Qty: {sale.quantity || 1} @ £{(sale.pricePerItem || 0).toFixed(2)}</span>
                                                        <span>{formatTimestamp(sale.timestamp)}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="italic text-xs text-light-text-secondary dark:text-dark-text-secondary">No sales recorded yet.</p>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;