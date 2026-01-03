'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

export default function CartRecommendations() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                // Get 4 random products
                const shuffled = data.sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 4));
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-wood-500" size={32} />
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="mt-16 pt-16 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-anthracite mb-8">Bunları da Beğenebilirsiniz</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
