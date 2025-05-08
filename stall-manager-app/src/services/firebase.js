import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously // Import signInAnonymously
} from "firebase/auth"; // Import auth functions
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp, 
    doc, 
    runTransaction, // Import runTransaction
    Timestamp, // Import Timestamp if needed for comparisons
    writeBatch, // Import writeBatch if not using transaction for reads/writes separation
    deleteDoc, // Import deleteDoc for removing entire documents
    updateDoc // Import updateDoc for updating documents
} from "firebase/firestore"; // Import necessary v9 functions

// Load environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Function to get stall details by seller PIN
const getStallDetails = async (pin) => {
  if (!pin) return null;
  const stallsRef = collection(firestore, 'stalls');
  // Query for the stall with the matching sellerPin
  const q = query(stallsRef, where("sellerPin", "==", pin));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No matching stall found for PIN:", pin);
    return null; // No stall found for this PIN
  }

  // Assuming PINs are unique, return the first match
  const stallDoc = querySnapshot.docs[0];
  return { id: stallDoc.id, ...stallDoc.data() };
};

// Updated function to record a sale using a transaction to decrement stock
const recordSale = async (stallId, productId, quantity) => {
  if (!stallId || !productId || quantity <= 0) {
    throw new Error("Invalid sale data provided");
  }

  const stallRef = doc(firestore, 'stalls', stallId);
  const salesRef = collection(firestore, 'sales');

  try {
    await runTransaction(firestore, async (transaction) => {
      const stallDoc = await transaction.get(stallRef);
      if (!stallDoc.exists()) {
        throw new Error("Stall document does not exist!");
      }

      const stallData = stallDoc.data();
      const products = stallData.products || [];
      let productPrice = 0;
      let productFound = false;

      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          productFound = true;
          productPrice = product.price; // Get the price for the sales record
          // Check if stockCount exists and is sufficient
          if (product.stockCount !== null && product.stockCount !== undefined) {
            if (product.stockCount < quantity) {
              throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stockCount}`);
            }
            // Decrement stock
            return { ...product, stockCount: product.stockCount - quantity };
          } else {
            // If stockCount is null/undefined, maybe it means infinite stock?
            // For now, we assume if stockCount isn't tracked, we can't decrement.
            // Or, if it means infinite, just return the product as is.
            // Let's assume for now it means we don't track stock for this item.
             return product; 
          }
        }
        return product;
      });

      if (!productFound) {
          throw new Error(`Product with ID ${productId} not found in stall ${stallId}.`);
      }
      
      // Update the stall document with the new products array (with updated stock)
      transaction.update(stallRef, { products: updatedProducts });

      // Create the sales record
      transaction.set(doc(salesRef), { // Use transaction.set for consistency
        stallId: stallId,
        productId: productId,
        quantity: quantity,
        pricePerItem: productPrice, // Store the price at the time of sale
        totalPrice: productPrice * quantity,
        timestamp: serverTimestamp() // Use serverTimestamp within transaction
      });
    });
    console.log("Transaction successfully committed!");
  } catch (error) {
    console.error("Transaction failed: ", error);
    // Re-throw the error so the calling function knows it failed
    throw error; 
  }
};

// --- Record Multiple Sales in a Single Transaction ---
const recordTransaction = async (stallId, items, paymentMethod) => {
    if (!stallId || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
        throw new Error("Invalid transaction data provided.");
    }

    const stallRef = doc(firestore, 'stalls', stallId);
    const salesRef = collection(firestore, 'sales');
    const currentTimestamp = serverTimestamp(); // Get timestamp once for all sales in transaction

    try {
        await runTransaction(firestore, async (transaction) => {
            const stallDoc = await transaction.get(stallRef);
            if (!stallDoc.exists()) {
                throw new Error("Stall document does not exist!");
            }

            const stallData = stallDoc.data();
            let currentProducts = [...(stallData.products || [])]; // Clone products array

            // Process each item in the cart
            for (const item of items) {
                const productIndex = currentProducts.findIndex(p => p.id === item.productId);

                if (productIndex === -1) {
                    throw new Error(`Product with ID ${item.productId} not found in stall.`);
                }

                const product = currentProducts[productIndex];

                // Check stock if tracked
                if (product.stockCount !== null && product.stockCount !== undefined) {
                    if (product.stockCount < item.quantity) {
                        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stockCount}, Requested: ${item.quantity}`);
                    }
                    // Update stock in the cloned array
                    currentProducts[productIndex] = {
                        ...product,
                        stockCount: product.stockCount - item.quantity
                    };
                }
                 // If stock not tracked, no change needed for this product in the array

                // Prepare sales record data (use price from item passed in, or re-lookup)
                 const pricePerItem = product.price; // Use current price from DB
                 const totalPrice = pricePerItem * item.quantity;


                // Add sales record to the transaction
                transaction.set(doc(salesRef), { // Create a new doc in sales collection
                    stallId: stallId,
                    productId: item.productId,
                    quantity: item.quantity,
                    pricePerItem: pricePerItem,
                    totalPrice: totalPrice,
                    paymentMethod: paymentMethod, // Record the payment method
                    timestamp: currentTimestamp // Use the same timestamp for all items in transaction
                });
            }

            // After processing all items, update the stall document with the final products array
            transaction.update(stallRef, { products: currentProducts });
        });

        console.log("Multi-item transaction successfully committed!");

    } catch (error) {
        console.error("Multi-item transaction failed: ", error);
        // Re-throw the error so the calling function (SellerPage) knows it failed
        throw error;
    }
};

// Function to get all sales for a specific stall
const getSalesForStall = async (stallId) => {
    if (!stallId) return [];
    const salesRef = collection(firestore, 'sales');
    const q = query(salesRef, where("stallId", "==", stallId));
    const querySnapshot = await getDocs(q);
    
    const salesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return salesData;
};

// Function to update a stall (name or other properties)
const updateStall = async (stallId, updateData) => {
    if (!stallId) {
        throw new Error("No stall ID provided for update");
    }
    
    const stallRef = doc(firestore, 'stalls', stallId);
    await updateDoc(stallRef, updateData);
    return true;
};

// Function to delete a stall
const deleteStall = async (stallId) => {
    if (!stallId) {
        throw new Error("No stall ID provided for deletion");
    }
    
    // Check if there are any sales for this stall
    const salesRef = collection(firestore, 'sales');
    const q = query(salesRef, where("stallId", "==", stallId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        throw new Error("Cannot delete stall with existing sales records. Archive it instead.");
    }
    
    const stallRef = doc(firestore, 'stalls', stallId);
    await deleteDoc(stallRef);
    return true;
};

// Function to update a product's stock count
const updateProductStock = async (stallId, productId, newStockCount) => {
    if (!stallId || !productId) {
        throw new Error("Stall ID and Product ID are required");
    }
    
    if (newStockCount < 0) {
        throw new Error("Stock count cannot be negative");
    }
    
    const stallRef = doc(firestore, 'stalls', stallId);
    
    try {
        await runTransaction(firestore, async (transaction) => {
            const stallDoc = await transaction.get(stallRef);
            if (!stallDoc.exists()) {
                throw new Error("Stall document does not exist!");
            }
            
            const stallData = stallDoc.data();
            const products = stallData.products || [];
            let productFound = false;
            
            const updatedProducts = products.map(product => {
                if (product.id === productId) {
                    productFound = true;
                    return { ...product, stockCount: newStockCount };
                }
                return product;
            });
            
            if (!productFound) {
                throw new Error(`Product with ID ${productId} not found in stall ${stallId}`);
            }
            
            transaction.update(stallRef, { products: updatedProducts });
        });
        
        return true;
    } catch (error) {
        console.error("Error updating product stock:", error);
        throw error;
    }
};

// Function to update a product (name, price, etc.)
const updateProduct = async (stallId, productId, updateData) => {
    if (!stallId || !productId) {
        throw new Error("Stall ID and Product ID are required");
    }
    
    const stallRef = doc(firestore, 'stalls', stallId);
    
    try {
        await runTransaction(firestore, async (transaction) => {
            const stallDoc = await transaction.get(stallRef);
            if (!stallDoc.exists()) {
                throw new Error("Stall document does not exist!");
            }
            
            const stallData = stallDoc.data();
            const products = stallData.products || [];
            let productFound = false;
            
            const updatedProducts = products.map(product => {
                if (product.id === productId) {
                    productFound = true;
                    return { ...product, ...updateData };
                }
                return product;
            });
            
            if (!productFound) {
                throw new Error(`Product with ID ${productId} not found in stall ${stallId}`);
            }
            
            transaction.update(stallRef, { products: updatedProducts });
        });
        
        return true;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

// Function to check if a product has any sales
const checkProductHasSales = async (stallId, productId) => {
    if (!stallId || !productId) {
        throw new Error("Stall ID and Product ID are required");
    }
    
    const salesRef = collection(firestore, 'sales');
    const q = query(salesRef, 
        where("stallId", "==", stallId),
        where("productId", "==", productId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Return true if sales exist, false if no sales
};

// Function to remove a product (only if it has no sales)
const removeProduct = async (stallId, productId) => {
    if (!stallId || !productId) {
        throw new Error("Stall ID and Product ID are required");
    }
    
    // Check if the product has any sales
    const hasSales = await checkProductHasSales(stallId, productId);
    if (hasSales) {
        throw new Error("Cannot remove a product that has sales records. You can update its stock to 0 instead.");
    }
    
    const stallRef = doc(firestore, 'stalls', stallId);
    
    try {
        await runTransaction(firestore, async (transaction) => {
            const stallDoc = await transaction.get(stallRef);
            if (!stallDoc.exists()) {
                throw new Error("Stall document does not exist!");
            }
            
            const stallData = stallDoc.data();
            const products = stallData.products || [];
            
            // Filter out the product to remove
            const updatedProducts = products.filter(product => product.id !== productId);
            
            // If the length is the same, the product wasn't found
            if (updatedProducts.length === products.length) {
                throw new Error(`Product with ID ${productId} not found in stall ${stallId}`);
            }
            
            transaction.update(stallRef, { products: updatedProducts });
        });
        
        return true;
    } catch (error) {
        console.error("Error removing product:", error);
        throw error;
    }
};

export { 
    auth, 
    firestore, 
    getStallDetails, 
    recordSale,
    recordTransaction,
    getSalesForStall,
    updateStall, // New: Update stall properties
    deleteStall, // New: Delete a stall
    updateProductStock, // New: Update a product's stock count
    updateProduct, // New: Update product properties
    checkProductHasSales, // New: Check if a product has sales
    removeProduct, // New: Remove a product
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously
};