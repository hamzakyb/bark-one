'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type GalleryItem = {
    _id?: string;
    image?: string;
    label?: string;
    tag?: string;
    span?: string;
    aspectRatio?: string;
};

type InspirationGalleryProps = {
    settings?: {
        badge?: string;
        heading?: string;
        description?: string;
        items?: GalleryItem[];
    };
};

const DEFAULT_BADGE = 'Galeri';
const DEFAULT_HEADING = 'Yaşam alanınıza ilham veren sahneler';
const DEFAULT_DESCRIPTION = 'Ürünlerimizi mekânınızın farklı zonlarına taşıyarak dengeyi keşfedin.';

const DEFAULT_ITEMS: GalleryItem[] = [
    {
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1200&auto=format&fit=crop',
        label: 'Modern Oturma Odası',
        tag: 'Signature Koleksiyon',
        span: 'md:col-span-2 md:row-span-2',
        aspectRatio: '4/5',
    },
    {
        image: 'https://images.unsplash.com/photo-1534349762913-5c4c58d3a3ea?q=80&w=1200&auto=format&fit=crop',
        label: 'Minimalist Mutfak',
        tag: 'Atelier Serisi',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1/1',
    },
    {
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
        label: 'Çalışma Alanı',
        tag: 'Studio Line',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1/1',
    },
    {
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
        label: 'Yatak Odası Detayı',
        tag: 'BarkOne Proje',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1/1',
    },
    {
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
        label: 'Kitaplık Köşesi',
        tag: 'Modüler Raf',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1/1',
    },
    {
        image: 'https://images.unsplash.com/photo-1554995711-ff5e1f6a5a3d?q=80&w=1200&auto=format&fit=crop',
        label: 'Koridor Dekoru',
        tag: 'Duvar Rafı',
        span: 'md:col-span-2 md:row-span-1',
        aspectRatio: '2/1',
    },
];

export default function InspirationGallery({ settings }: InspirationGalleryProps) {
    const badge = settings?.badge || DEFAULT_BADGE;
    const heading = settings?.heading || DEFAULT_HEADING;
    const description = settings?.description || DEFAULT_DESCRIPTION;

    const providedItems = (settings?.items ?? []).filter((item) =>
        Boolean(item && (item.image?.trim() || item.label?.trim() || item.tag?.trim()))
    );
    const items = providedItems.length ? providedItems : DEFAULT_ITEMS;

    return (
        <section id="inspiration" className="py-32 md:py-40 bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Editorial Header */}
                <div className="flex flex-col items-center text-center mb-24 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-2 px-6 rounded-full border border-stone-200 bg-white/40 backdrop-blur-md text-xs font-bold tracking-[0.25em] uppercase text-stone-500 mb-8 shadow-sm">
                            {badge}
                        </span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 leading-[1.05] tracking-tight mb-8">
                            {heading}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-stone-400 to-transparent mx-auto mb-8 opacity-50" />
                        <p className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
                            {description}
                        </p>
                    </motion.div>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px] md:auto-rows-[300px]">
                    {items.map((item, index) => {
                        const fallback = DEFAULT_ITEMS[index % DEFAULT_ITEMS.length];
                        const imageSrc = item.image?.trim() || fallback.image || '';
                        const label = item.label?.trim() || fallback.label || 'Galeri görseli';
                        const tag = item.tag?.trim() || fallback.tag || '';
                        // Clean span classes and ensure defaults
                        const span = item.span?.trim() || fallback.span || 'md:col-span-1 md:row-span-1';

                        return (
                            <motion.div
                                key={item._id ?? `gallery-item-${index}`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                className={cn(
                                    "relative group overflow-hidden rounded-md", // slightly softer corners
                                    span
                                )}
                            >
                                <Link href="/products" className="block h-full w-full">
                                    <div className="relative h-full w-full overflow-hidden bg-stone-200">
                                        {imageSrc ? (
                                            <Image
                                                src={imageSrc}
                                                alt={label}
                                                fill
                                                className="object-cover transition-transform duration-[1.2s] ease-in-out group-hover:scale-110"
                                                sizes="(min-width: 1280px) 600px, (min-width: 768px) 400px, 100vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                                                <span className="text-xs uppercase tracking-widest">Görsel Yok</span>
                                            </div>
                                        )}

                                        {/* Overlay - Elegant Dark Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                        {/* Content - Bottom Aligned */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            {tag && (
                                                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 mb-2 border-l-2 border-white/50 pl-3">
                                                    {tag}
                                                </span>
                                            )}
                                            <div className="flex items-end justify-between">
                                                <h3 className="text-xl md:text-2xl font-serif text-white leading-tight max-w-[80%]">
                                                    {label}
                                                </h3>
                                                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black hover:border-white">
                                                    <ArrowUpRight size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Overlay Icon (Center) */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none">
                                            <Plus className="text-white" size={24} strokeWidth={1} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer / CTA Area */}
                <div className="mt-20 md:mt-32 flex flex-col items-center">
                    <p className="text-sm font-semibold tracking-[0.2em] uppercase text-stone-400 mb-8">
                        Daha fazla ilham mı arıyorsunuz?
                    </p>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full px-10 py-7 text-xs font-bold tracking-[0.2em] uppercase border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-500"
                    >
                        <Link href="/products">
                            Ürünleri Keşfet
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
