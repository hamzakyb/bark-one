'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ShoppingBag, ArrowRight, Home, Package } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // URL'den sipariş numarasını al veya localStorage'dan oku
        const urlParams = new URLSearchParams(window.location.search);
        const orderFromUrl = urlParams.get('order');
        const orderFromStorage = localStorage.getItem('lastOrderNumber');
        
        const order = orderFromUrl || orderFromStorage || '';
        setOrderNumber(order);
        setIsLoading(false);

        // Sipariş numarasını localStorage'a kaydet
        if (order && !orderFromStorage) {
            localStorage.setItem('lastOrderNumber', order);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    {/* Success Card */}
                    <div className="rounded-[32px] border border-white/40 bg-white/80 p-10 shadow-[0_35px_120px_-70px_rgba(15,15,15,0.35)] backdrop-blur">
                        <div className="text-center space-y-6">
                            {/* Success Icon */}
                            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>

                            {/* Success Message */}
                            <div className="space-y-4">
                                <h1 className="text-3xl font-light text-anthracite md:text-[38px]">
                                    Siparişiniz Alındı!
                                </h1>
                                <p className="text-stone-600 leading-relaxed">
                                    Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu ve en kısa sürede işleme alınacaktır.
                                </p>
                            </div>

                            {/* Order Number */}
                            {orderNumber && (
                                <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-6 py-3">
                                    <Package className="w-4 h-4 text-stone-500" />
                                    <span className="text-sm font-medium text-stone-700">
                                        Sipariş No: {orderNumber}
                                    </span>
                                </div>
                            )}

                            {/* Next Steps */}
                            <div className="bg-stone-50 rounded-[20px] p-6 text-left">
                                <h3 className="font-semibold text-anthracite mb-3">Sonraki Adımlar</h3>
                                <ul className="space-y-2 text-sm text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-wood-500 mt-1.5 flex-shrink-0"></div>
                                        <span>Siparişiniz en kısa sürede işleme alınacaktır</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-wood-500 mt-1.5 flex-shrink-0"></div>
                                        <span>Ödeme bilgilerinizi kontrol edip onaylayacağız</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-wood-500 mt-1.5 flex-shrink-0"></div>
                                        <span>Kargoya verildiğinde bilgilendirileceksiniz</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-anthracite transition-all hover:border-wood-400 hover:bg-wood-50"
                                >
                                    <Home className="w-4 h-4" />
                                    Ana Sayfaya Dön
                                </Link>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-wood-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-wood-600"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Alışverişe Devam Et
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-stone-500">
                            Sorularınız için bize{' '}
                            <Link href="/contact" className="text-wood-600 hover:text-wood-700 font-medium">
                                ulaşabilirsiniz
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
