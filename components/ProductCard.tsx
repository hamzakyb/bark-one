'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        slug?: string;
        description: string;
        category?: string;
        stock?: number;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const isInStock = (product.stock || 0) > 0;
    const formattedPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isInStock) {
            toast.error('Bu ürün stokta bulunmamaktadır');
            return;
        }

        try {
            await addToCart(product, 1);
            toast.success(`${product.name} sepete eklendi`);
        } catch {
            toast.error('Ürün sepete eklenirken bir hata oluştu');
        }
    };

    const handleAddToWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.success(`${product.name} favorilere eklendi`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group h-full"
        >
            <Link href={`/product/${product._id}`} className="block h-full">
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    {/* Product Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <>
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                {/* Stock Badge */}
                                {!isInStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Badge variant="destructive" className="text-sm px-4 py-2">
                                            Stokta Yok
                                        </Badge>
                                    </div>
                                )}

                                {/* Category Badge */}
                                {product.category && (
                                    <div className="absolute top-3 left-3">
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/90 backdrop-blur text-xs font-medium"
                                        >
                                            {product.category === 'signature' && 'Signature'}
                                            {product.category === 'atelier' && 'Atelier'}
                                            {product.category === 'studio' && 'Studio'}
                                        </Badge>
                                    </div>
                                )}

                                {/* Quick Actions - Only show wishlist and view */}
                                <div className="absolute inset-x-3 bottom-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleAddToWishlist}
                                        className="h-9 w-9 rounded-full p-0 bg-white/90 hover:bg-white"
                                    >
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-full p-0 bg-white/90 hover:bg-white"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <div className="text-center text-gray-400">
                                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gray-200" />
                                    <p className="text-sm">Görsel Yok</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-5">
                        <div className="space-y-3">
                            {/* Product Name */}
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                                {product.name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-4 w-4",
                                                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">(4.0)</span>
                            </div>
                        </div>
                    </CardContent>

                    {/* Footer with Price and Add to Cart */}
                    <CardFooter className="p-5 pt-0">
                        <div className="w-full flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
                                <p className="text-xs text-gray-500">KDV Dahil</p>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                size="sm"
                                className="rounded-full"
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Sepete Ekle
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}
