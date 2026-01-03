'use client';

import { useState, useEffect } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    sort: string;
    setSort: (sort: string) => void;
    minPrice: number;
    maxPrice: number;
}

export default function ProductFilter({
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sort,
    setSort,
    minPrice,
    maxPrice
}: FilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close filter on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderFilterContent = () => (
        <div className="space-y-10">
            {/* Categories */}
            <div className="space-y-5">
                <h3 className="text-xs font-medium uppercase tracking-[0.35em] text-stone-500">Kategori</h3>
                <div className="flex flex-wrap gap-3">
                    {[{ label: 'Tümü', value: 'all' }, ...categories.map((category) => ({ label: category, value: category }))].map(({ label, value }) => {
                        const isActive = selectedCategory === value;
                        return (
                            <button
                                key={value}
                                onClick={() => setSelectedCategory(value)}
                                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.35em] transition-all duration-300 ${isActive
                                    ? 'border-wood-500 bg-wood-500 text-white shadow-[0_15px_40px_-20px_rgba(139,92,52,0.6)]'
                                    : 'border-stone-300/70 bg-white/80 text-stone-600 hover:border-wood-400 hover:text-wood-600'}`}
                            >
                                {label}
                                {isActive && <Check size={14} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-5">
                <h3 className="text-xs font-medium uppercase tracking-[0.35em] text-stone-500">Fiyat Aralığı</h3>
                <div className="rounded-[28px] border border-stone-200/70 bg-white/80 p-6 shadow-[0_22px_60px_-32px_rgba(20,20,20,0.35)] backdrop-blur">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">Minimum</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">₺</span>
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    placeholder="Min"
                                    min={minPrice}
                                    className="w-full min-w-[120px] rounded-full border border-stone-300/70 bg-white/80 pl-9 pr-4 py-3 text-sm font-medium tracking-[0.12em] text-anthracite placeholder:text-stone-400 focus:border-wood-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">Maksimum</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">₺</span>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    placeholder="Max"
                                    max={maxPrice}
                                    className="w-full min-w-[120px] rounded-full border border-stone-300/70 bg-white/80 pl-9 pr-4 py-3 text-sm font-medium tracking-[0.12em] text-anthracite placeholder:text-stone-400 focus:border-wood-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 px-1">
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-wood-500"
                        />
                        <div className="mt-3 flex justify-between text-xs font-medium uppercase tracking-[0.35em] text-stone-400">
                            <span>{new Intl.NumberFormat('tr-TR').format(priceRange[0])}</span>
                            <span>{new Intl.NumberFormat('tr-TR').format(priceRange[1])}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort */}
            <div className="space-y-5">
                <h3 className="text-xs font-medium uppercase tracking-[0.35em] text-stone-500">Sıralama</h3>
                <div className="flex flex-col gap-3">
                    {[{ value: 'newest', label: 'En Yeniler' }, { value: 'price_asc', label: 'Fiyat (Artan)' }, { value: 'price_desc', label: 'Fiyat (Azalan)' }].map(({ value, label }) => {
                        const isActive = sort === value;
                        return (
                            <button
                                key={value}
                                onClick={() => setSort(value)}
                                className={`flex items-center justify-between rounded-full border px-6 py-3 text-xs font-medium uppercase tracking-[0.35em] transition-all duration-300 ${isActive
                                    ? 'border-wood-500 bg-wood-500 text-white shadow-[0_22px_50px_-24px_rgba(139,92,52,0.6)]'
                                    : 'border-stone-300/70 bg-white/80 text-stone-600 hover:border-wood-400 hover:text-wood-600'}`}
                            >
                                {label}
                                {isActive && <Check size={16} />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3.5 rounded-xl font-bold text-anthracite shadow-sm active:scale-[0.99] transition-transform"
                >
                    <Filter size={20} />
                    Filtrele ve Sırala
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24">
                    {renderFilterContent()}
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-anthracite">Filtrele</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            {renderFilterContent()}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-anthracite text-white py-4 rounded-xl font-bold hover:bg-wood-500 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Sonuçları Göster
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
