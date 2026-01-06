'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Shield, Truck, Package, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback } from 'react';
import ProductCard from './ProductCard';

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

    const rawSpotlightItems = settings?.items?.filter(
        item => item && (item.title || item.image)
    ) ?? [];

    const hasSpotlightItems = rawSpotlightItems.length > 0;

    let displayItems: (SpotlightItem | Product)[] = [];

    if (hasSpotlightItems) {
        // Reduced duplication threshold slightly as we are using slide widths efficiently
        displayItems = rawSpotlightItems.length < 5 ? [...rawSpotlightItems, ...rawSpotlightItems, ...rawSpotlightItems] : rawSpotlightItems;
    } else {
        const productSource = products.slice(0, 10);
        displayItems = productSource.length < 5 ? [...productSource, ...productSource, ...productSource] : productSource;
    }

    // Embla Carousel Configuration
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
    }, [
        Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false, rootNode: (emblaRoot) => emblaRoot.parentElement })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

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

                    {/* Navigation Controls & CTA */}
                    <div className="flex flex-col items-end gap-6 hidden md:flex">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full h-auto py-3 px-6 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 uppercase tracking-widest text-xs font-semibold group ml-auto"
                        >
                            <Link href={ctaUrl} className="flex items-center gap-2">
                                {ctaLabel}
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollPrev}
                                className="rounded-full w-12 h-12 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
                            >
                                <ArrowLeft size={20} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollNext}
                                className="rounded-full w-12 h-12 border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
                            >
                                <ArrowRight size={20} />
                            </Button>
                        </div>
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
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-6 cursor-grab active:cursor-grabbing">
                        {displayItems.map((item, idx) => {
                            // Determine if it's a SpotlightItem or Product
                            const isSpotlightItem = 'title' in item && !('slug' in item);
                            const product = !isSpotlightItem ? (item as Product) : null;
                            const spotlight = isSpotlightItem ? (item as SpotlightItem) : null;
                            const key = product ? `prod-${product._id}-${idx}` : `spot-${spotlight?._id || idx}-${idx}`;

                            return (
                                <div key={key} className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_22%] min-w-0 pl-6">
                                    {isSpotlightItem ? (
                                        <motion.div
                                            whileHover={{ y: -8 }}
                                            transition={{ duration: 0.3 }}
                                            className="group h-full"
                                        >
                                            <Link href={spotlight?.href || '#'} className="block h-full">
                                                <div className="relative aspect-square overflow-hidden bg-stone-100 mb-4 rounded-sm">
                                                    {spotlight?.image ? (
                                                        <Image
                                                            src={spotlight.image}
                                                            alt={spotlight.title || 'Product'}
                                                            fill
                                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                                                            <Package size={48} strokeWidth={1} />
                                                        </div>
                                                    )}
                                                    {/* Dark Overlay on Hover */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                                                    {spotlight?.price && (
                                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                            {spotlight.price}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-serif text-stone-900 group-hover:text-wood-600 transition-colors duration-300 truncate">
                                                        {spotlight?.title}
                                                    </h3>
                                                    <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed font-light">
                                                        {spotlight?.description}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full transform transition-transform duration-300 hover:-translate-y-2">
                                            <ProductCard product={product!} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Controls & CTA */}
                <div className="flex flex-col items-center gap-6 mt-12 md:hidden">
                    <div className="flex gap-4">
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
                    <Button
                        asChild
                        variant="ghost"
                        className="text-stone-500 uppercase tracking-widest text-xs font-semibold hover:bg-transparent hover:text-stone-900"
                    >
                        <Link href={ctaUrl} className="flex items-center gap-2">
                            {ctaLabel}
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
