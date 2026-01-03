'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingCart, Check, Truck, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetails {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    specifications?: Record<string, string | number>;
}

interface AccordionItemProps {
    id: string;
    title: string;
    isOpen: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}

function AccordionItem({ id, title, isOpen, onToggle, children }: AccordionItemProps) {
    return (
        <div className="border-b border-stone-200/60">
            <button
                onClick={() => onToggle(id)}
                className="flex w-full items-center justify-between py-4 text-left transition-colors duration-300 hover:text-wood-500"
            >
                <span className="text-base font-medium text-anthracite">{title}</span>
                <ChevronDown
                    className={`h-5 w-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-wood-500' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 text-stone-600">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface ProductInfoProps {
    product: ProductDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>('details');

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="space-y-8 rounded-[32px] border border-stone-200/80 bg-white/90 p-8 shadow-[0_28px_90px_-50px_rgba(15,15,15,0.55)] backdrop-blur-lg">
            <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/60 bg-wood-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.45em] text-wood-500">
                    BarkOne Raf
                </span>
                <h1 className="text-3xl md:text-[44px] font-light leading-[1.2] text-anthracite">
                    {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 border-t border-b border-stone-200/70 py-4">
                    <p className="text-3xl md:text-[36px] font-semibold text-wood-500">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                    </p>
                    {product.stock > 0 && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-green-700">
                            Stokta Mevcut
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4 text-base font-light leading-relaxed text-stone-600">
                <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-stone-200/60">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex items-stretch rounded-full border border-stone-200/70 bg-white/80 shadow-[0_18px_50px_-35px_rgba(15,15,15,0.4)]">
                        <button
                            onClick={decreaseQuantity}
                            className="flex h-14 w-14 items-center justify-center rounded-l-full border-r border-stone-200/60 text-stone-500 transition-colors duration-300 hover:bg-stone-50 hover:text-wood-500 disabled:opacity-60"
                            disabled={quantity <= 1}
                        >
                            <Minus size={20} />
                        </button>
                        <span className="flex h-14 w-20 items-center justify-center text-lg font-semibold tracking-[0.25em] text-anthracite">
                            {quantity}
                        </span>
                        <button
                            onClick={increaseQuantity}
                            className="flex h-14 w-14 items-center justify-center rounded-r-full border-l border-stone-200/60 text-stone-500 transition-colors duration-300 hover:bg-stone-50 hover:text-wood-500 disabled:opacity-60"
                            disabled={quantity >= product.stock}
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`flex-1 rounded-full border px-8 py-4 text-sm font-semibold uppercase tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-3 ${isAdded
                            ? 'border-green-400/70 bg-green-500 text-white shadow-[0_20px_60px_-30px_rgba(34,197,94,0.6)]'
                            : 'border-anthracite/80 bg-anthracite text-white hover:border-wood-400 hover:bg-wood-500 hover:shadow-[0_28px_80px_-40px_rgba(139,92,52,0.65)] hover:-translate-y-0.5'
                            } disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400 disabled:shadow-none disabled:translate-y-0`}
                    >
                        {isAdded ? (
                            <>
                                <Check size={24} />
                                Sepete Eklendi
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={24} />
                                Sepete Ekle
                            </>
                        )}
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-[28px] border border-stone-200/70 bg-white/90 p-5 text-sm font-medium text-stone-500 shadow-[0_22px_70px_-42px_rgba(15,15,15,0.4)]">
                        <Truck className="h-5 w-5 text-wood-500" />
                        <span>Hızlı teslimat koordinasyonu</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-[28px] border border-stone-200/70 bg-white/90 p-5 text-sm font-medium text-stone-500 shadow-[0_22px_70px_-42px_rgba(15,15,15,0.4)]">
                        <ShieldCheck className="h-5 w-5 text-wood-500" />
                        <span>2 yıl ürün desteği</span>
                    </div>
                </div>
            </div>

            {/* Accordions */}
            <div className="rounded-[28px] border border-stone-200/60 bg-white/70 px-2">
                <AccordionItem id="details" title="Ürün Detayları" isOpen={openAccordion === 'details'} onToggle={toggleAccordion}>
                    <p className="mb-4 text-sm leading-relaxed text-stone-600">{product.description}</p>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li>%100 Doğal Ahşap</li>
                        <li>El İşçiliği</li>
                        <li>Su Bazlı Koruyucu Cila</li>
                    </ul>
                </AccordionItem>

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <AccordionItem id="specs" title="Teknik Özellikler" isOpen={openAccordion === 'specs'} onToggle={toggleAccordion}>
                        <dl className="grid grid-cols-1 gap-y-3 text-sm text-stone-600">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-stone-100/80 bg-white/60 px-4 py-3">
                                    <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                                    <dd className="text-sm font-medium text-anthracite">{String(value)}</dd>
                                </div>
                            ))}
                        </dl>
                    </AccordionItem>
                )}

                <AccordionItem id="shipping" title="Teslimat ve İade" isOpen={openAccordion === 'shipping'} onToggle={toggleAccordion}>
                    <p className="text-sm leading-relaxed text-stone-600">
                        Siparişleriniz 1-3 iş günü içerisinde kargoya verilir.
                        Üründen memnun kalmamanız durumunda 14 gün içerisinde ücretsiz iade edebilirsiniz.
                    </p>
                </AccordionItem>
            </div>
        </div>
    );
}
