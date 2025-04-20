import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; // Import Firebase database
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

const AdminDashboard = () => {
    const [stalls, setStalls] = useState([]);
    const [stallName, setStallName] = useState('');
    const [productName, setProductName] = useState('');
    const [sellerPin, setSellerPin] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'stalls'), (snapshot) => {
            const stallsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStalls(stallsData);
        });
        return () => unsubscribe();
    }, []);

    const handleAddStall = async (e) => {
        e.preventDefault();
        if (stallName) {
            await addDoc(collection(db, 'stalls'), { name: stallName, products: [] });
            setStallName('');
        }
    };

    const handleAddProduct = async (stallId) => {
        if (productName) {
            const stallRef = db.collection('stalls').doc(stallId);
            await stallRef.update({
                products: firebase.firestore.FieldValue.arrayUnion(productName)
            });
            setProductName('');
        }
    };

    const handleAssignSeller = async (stallId) => {
        if (sellerPin) {
            const stallRef = db.collection('stalls').doc(stallId);
            await stallRef.update({ sellerPin });
            setSellerPin('');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <form onSubmit={handleAddStall} className="my-4">
                <input
                    type="text"
                    value={stallName}
                    onChange={(e) => setStallName(e.target.value)}
                    placeholder="Stall Name"
                    className="border p-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Add Stall</button>
            </form>
            <div>
                {stalls.map(stall => (
                    <div key={stall.id} className="border p-4 my-2">
                        <h2 className="text-xl">{stall.name}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(stall.id); }}>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Product Name"
                                className="border p-2"
                            />
                            <button type="submit" className="bg-green-500 text-white p-2 ml-2">Add Product</button>
                        </form>
                        <form onSubmit={(e) => { e.preventDefault(); handleAssignSeller(stall.id); }}>
                            <input
                                type="text"
                                value={sellerPin}
                                onChange={(e) => setSellerPin(e.target.value)}
                                placeholder="Seller PIN"
                                className="border p-2"
                            />
                            <button type="submit" className="bg-yellow-500 text-white p-2 ml-2">Assign Seller</button>
                        </form>
                        <h3 className="mt-2">Products:</h3>
                        <ul>
                            {stall.products.map((product, index) => (
                                <li key={index}>{product}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;