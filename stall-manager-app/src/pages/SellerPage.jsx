import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { getStallDetails, recordSale } from '../services/firebase';

const SellerPage = () => {
    const { pin } = useParams();
    const [stall, setStall] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStallDetails = async () => {
            const stallData = await getStallDetails(pin);
            setStall(stallData);
            setLoading(false);
        };

        fetchStallDetails();
    }, [pin]);

    const handleRecordSale = async (productId, quantity) => {
        await recordSale(stall.id, productId, quantity);
        // Optionally, you can update the local state or show a success message
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to Your Stall!</h1>
            {stall ? (
                <>
                    <h2 className="text-xl mb-2">{stall.name}</h2>
                    <ProductList products={stall.products} onRecordSale={handleRecordSale} />
                </>
            ) : (
                <div className="text-red-500">Stall not found.</div>
            )}
        </div>
    );
};

export default SellerPage;