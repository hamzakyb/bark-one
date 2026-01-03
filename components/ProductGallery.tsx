'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                Görsel Yok
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 lg:space-y-8 lg:sticky lg:top-24">
                <div
                    className="relative aspect-square overflow-hidden rounded-[32px] border border-stone-200/60 bg-linear-to-br from-white via-white/95 to-stone-50 shadow-[0_40px_120px_-60px_rgba(15,15,15,0.55)] transition-transform duration-700 hover:-translate-y-1 cursor-zoom-in"
                    onClick={() => setIsZoomed(true)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={images[selectedImage]}
                                alt={`${name} - Görsel ${selectedImage + 1}`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-transparent to-stone-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-stone-500 shadow-[0_20px_40px_-28px_rgba(15,15,15,0.45)] transition-all duration-300 group-hover:border-wood-400/70 group-hover:text-wood-500">
                        <Maximize2 className="w-4 h-4" />
                        BÜYÜT
                    </div>
                </div>

                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`group relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 ${selectedImage === index
                                    ? 'border-wood-500 bg-wood-500/5 shadow-[0_18px_40px_-28px_rgba(15,15,15,0.45)]'
                                    : 'border-stone-200/70 bg-white/70 hover:border-wood-300'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${name} - Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Zoom Modal */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10"
                        onClick={() => setIsZoomed(false)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/80 hover:text-white p-2"
                            onClick={() => setIsZoomed(false)}
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full h-full max-w-5xl max-h-[90vh] aspect-square md:aspect-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedImage]}
                                alt={`${name} - Zoom`}
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
