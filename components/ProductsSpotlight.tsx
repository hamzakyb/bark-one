'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Shield, Truck, Package, Star, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useState, useEffect } from 'react';

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
    const badge = settings?.badge || 'Raf Ürünlerimiz';
    const heading = settings?.heading || 'Öne çıkan duvar rafları';
    const description = settings?.description || 'Oturma odasından çalışma alanına kadar düzen ve depolama sağlayan raf çözümlerimizi keşfedin.';
    const ctaLabel = settings?.ctaLabel || 'Tüm Ürünleri Gör';
    const ctaUrl = settings?.ctaUrl || '/products';

    const spotlightItems = settings?.items?.filter(
        item => item && (item.title || item.image)
    ) ?? [];


    // Embla Carousel Configuration
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
    }, [
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Check if we have enough items to carousel, otherwise fallback to grid or duplicate for infinite feel
    // For infinite loop to work seamlessly with few items, Embla recommends duplicating content or having enough slides.
    // We'll trust Embla's loop logic but ensure we pass a decent number of items.

    const displayItems = spotlightItems.length > 0 ? spotlightItems : products.slice(0, 8); // Take 8 to ensure loop works better

    return (
        <section className="relative py-32 bg-stone-50 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[20%] left-0 w-[800px] h-[800px] bg-stone-100/60 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between mb-16">
                    <div className="max-w-2xl">
                        <span className="inline-block py-2 px-4 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-stone-500 mb-6">
                            {badge}
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-[1.1] mb-8">
                            {heading}
                        </h2>
                        <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-lg">
                            {description}
                        </p>
                    </div>

                    {/* Navigation Controls (Senior Designer Style) */}
                    <div className="flex items-center gap-4 hidden md:flex">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            className="rounded-full w-14 h-14 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            className="rounded-full w-14 h-14 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
                        >
                            <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* Trust Indicators Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-16 border-y border-stone-200 py-10">
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
                </div>

                {/* Embla Slider */}
                <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
                    <div className="flex gap-8 cursor-grab active:cursor-grabbing">
                        {spotlightItems.length > 0 ? (
                            spotlightItems.map((item, idx) => (
                                <div key={idx} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_28%] min-w-0">
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className="group h-full"
                                    >
                                        <Link href={item.href || '#'} className="block h-full">
                                            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6 rounded-sm">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title || 'Product'}
                                                        fill
                                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                                                        <Package size={48} strokeWidth={1} />
                                                    </div>
                                                )}
                                                {/* Dark Overlay on Hover */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                                                {item.price && (
                                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                        {item.price}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-serif text-stone-900 group-hover:text-wood-600 transition-colors duration-300">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>
                            ))
                        ) : (
                            /* Fallback Products Slider */
                            products.slice(0, 10).map((product, idx) => (
                                <div key={product._id} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_28%] min-w-0">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile Controls (Visible only on small screens) */}
                <div className="flex items-center justify-center gap-4 mt-8 md:hidden">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollPrev}
                        className="rounded-full w-12 h-12 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollNext}
                        className="rounded-full w-12 h-12 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white"
                    >
                        <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
        </section>
    );
}
