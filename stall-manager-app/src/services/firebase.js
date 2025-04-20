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
    Timestamp // Import Timestamp if needed for comparisons
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

export { 
    auth, 
    firestore, 
    getStallDetails, 
    recordSale, // Updated
    getSalesForStall, // New
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously // Export signInAnonymously
}; // Export the new functions