'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Eye, Heart } from 'lucide-react';

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
const DEFAULT_DESCRIPTION =
    'Ürünlerimizi mekânınızın farklı zonlarına taşıyarak hacim, ışık ve doku ilişkisinin nasıl kusursuz bir denge oluşturduğunu keşfedin.';

const DEFAULT_ITEMS: GalleryItem[] = [
    {
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1200&auto=format&fit=crop',
        label: 'Modern Oturma Odası',
        tag: 'Signature Koleksiyon',
        span: 'md:col-span-2 md:row-span-2',
        aspectRatio: '4 / 5',
    },
    {
        image: 'https://images.unsplash.com/photo-1534349762913-5c4c58d3a3ea?q=80&w=1200&auto=format&fit=crop',
        label: 'Minimalist Mutfak',
        tag: 'Atelier Serisi',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1 / 1',
    },
    {
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
        label: 'Çalışma Alanı',
        tag: 'Studio Line',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1 / 1',
    },
    {
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
        label: 'Yatak Odası Detayı',
        tag: 'BarkOne Proje',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1 / 1',
    },
    {
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
        label: 'Kitaplık Köşesi',
        tag: 'Modüler Raf',
        span: 'md:col-span-1 md:row-span-1',
        aspectRatio: '1 / 1',
    },
    {
        image: 'https://images.unsplash.com/photo-1554995711-ff5e1f6a5a3d?q=80&w=1200&auto=format&fit=crop',
        label: 'Koridor Dekoru',
        tag: 'Duvar Rafı',
        span: 'md:col-span-2 md:row-span-1',
        aspectRatio: '2 / 1',
    },
];

export default function InspirationGallery({ settings }: InspirationGalleryProps) {
    const badge = settings?.badge?.trim() || DEFAULT_BADGE;
    const heading = settings?.heading?.trim() || DEFAULT_HEADING;
    const description = settings?.description?.trim() || DEFAULT_DESCRIPTION;
    const providedItems = (settings?.items ?? []).filter((item) =>
        Boolean(item && (item.image?.trim() || item.label?.trim() || item.tag?.trim()))
    );
    const items = providedItems.length ? providedItems : DEFAULT_ITEMS;

    return (
        <section id="inspiration" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 text-sm font-medium">
                        {badge}
                    </Badge>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        {description}
                    </p>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/products">
                            Ürünleri Keşfet
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px] lg:auto-rows-[250px]">
                    {items.map((item, index) => {
                        const fallback = DEFAULT_ITEMS[index % DEFAULT_ITEMS.length];
                        const imageSrc = item.image?.trim() || fallback.image || '';
                        const label = item.label?.trim() || fallback.label || 'Galeri görseli';
                        const tag = item.tag?.trim() || fallback.tag || 'Raf Ürünleri';
                        const span = item.span?.trim() || fallback.span || 'md:col-span-1 md:row-span-1';
                        const isDataUrl = imageSrc.startsWith('data:');

                        return (
                            <motion.div
                                key={item._id ?? `${label}-${index}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`${span} group relative overflow-hidden rounded-lg`}
                            >
                                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="relative w-full h-full">
                                        {imageSrc ? (
                                            <Image
                                                src={imageSrc}
                                                alt={label}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(min-width: 1280px) 400px, (min-width: 768px) 300px, 100vw"
                                                unoptimized={isDataUrl}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <div className="text-center text-gray-400">
                                                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-200" />
                                                    <p className="text-sm">Görsel Yok</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        {/* Quick Actions */}
                                        <div className="absolute inset-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 w-8 rounded-full p-0 bg-white/90 hover:bg-white"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 w-8 rounded-full p-0 bg-white/90 hover:bg-white"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <div className="space-y-2">
                                                <Badge variant="secondary" className="bg-white/20 backdrop-blur text-white text-xs">
                                                    {tag}
                                                </Badge>
                                                <h3 className="font-semibold text-lg drop-shadow-lg">
                                                    {label}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <Card className="inline-block border-0 shadow-lg p-8 bg-white">
                        <CardContent className="p-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Kendi stilinizi bulun
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md">
                                Binlerce kombinasyon arasından yaşam alanınızla mükemmel uyum sağlayan raf sistemini keşfedin.
                            </p>
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="/products">
                                    Tüm Galeriyi Gör
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
