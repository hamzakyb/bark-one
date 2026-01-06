'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Shield, Truck, Package, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard'; // Assuming we reuse this for grid items, or maybe custom cards for spotlight
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    specifications: Record<string, unknown>;
    createdAt: string | null;
    updatedAt: string | null;
}

interface SpotlightItem {
    _id?: string;
    title?: string;
    description?: string;
    price?: string;
    image?: string;
    href?: string;
}

interface ProductsSpotlightProps {
    settings?: {
        badge?: string;
        heading?: string;
        description?: string;
        ctaLabel?: string;
        ctaUrl?: string;
        items?: SpotlightItem[];
    };
    products: Product[];
}

const trustItems = [
    {
        icon: Shield,
        title: "2 Yıl Garanti",
        desc: "Tüm ürünlerimizde"
    },
    {
        icon: Truck,
        title: "Ücretsiz Kargo",
        desc: "1500 TL ve üzeri"
    },
    {
        icon: Package,
        title: "Hızlı Teslimat",
        desc: "3-5 iş günü"
    },
    {
        icon: Star,
        title: "Müşteri Memnuniyeti",
        desc: "4.8/5 puan"
    }
];

export default function ProductsSpotlight({ settings, products }: ProductsSpotlightProps) {
    // Show only first 4 products if no spotlight items, or specific spotlight logic
    // The user request implies this section IS the product showcase. 
    // They want 'Öne çıkan duvar rafları' etc. 

    const badge = settings?.badge || 'Raf Ürünlerimiz';
    const heading = settings?.heading || 'Öne çıkan duvar rafları';
    const description = settings?.description || 'Oturma odasından çalışma alanına kadar düzen ve depolama sağlayan raf çözümlerimizi keşfedin.';
    const ctaLabel = settings?.ctaLabel || 'Tüm Ürünleri Gör';
    const ctaUrl = settings?.ctaUrl || '/products';

    const spotlightItems = settings?.items?.filter(
        item => item && (item.title || item.image)
    ) ?? [];


    return (
        <section className="relative py-32 bg-stone-50 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[20%] left-0 w-[800px] h-[800px] bg-stone-100/60 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Editorial Header */}
                <div className="flex flex-col md:flex-row gap-12 md:items-end justify-between mb-24">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-2 px-4 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-stone-500 mb-6">
                                {badge}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-[1.1] mb-8">
                                {heading}
                            </h2>
                            <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-lg">
                                {description}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-shrink-0"
                    >
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full h-auto py-4 px-8 border-stone-300 text-stone-800 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-500 uppercase tracking-widest text-xs font-semibold group"
                        >
                            <Link href={ctaUrl} className="flex items-center gap-2">
                                {ctaLabel}
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Trust Indicators Strip - Stylish Implementation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-24 border-y border-stone-200 py-10"
                >
                    {trustItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                                <item.icon size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="font-serif text-lg text-stone-900">{item.title}</h4>
                                <p className="text-xs tracking-wider uppercase text-stone-500 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Spotlight Grid or Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* 
                       Logic: If spotlight items exist in settings, show those (managed by admin). 
                       Otherwise, fall back to showing actual products from the DB. 
                       This keeps admin flexibility active.
                     */}
                    {spotlightItems.length > 0 ? (
                        spotlightItems.map((item, idx) => (
                            <motion.div
                                key={item._id || idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link href={item.href || '#'}>
                                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title || 'Product'}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                                                <Package size={48} strokeWidth={1} />
                                            </div>
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                                        {item.price && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                {item.price}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-serif text-stone-900 mb-2 group-hover:text-stone-600 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-stone-500 line-clamp-2">{item.description}</p>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        /* Fallback to actual products if no spotlight items configured */
                        products.slice(0, 4).map((product, idx) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
