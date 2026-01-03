'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    const handleCopy = () => {
        if (orderNumber) {
            navigator.clipboard.writeText(orderNumber);
            alert('Sipariş numarası kopyalandı!');
        }
    };

    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 text-center">
                <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>

                    <h1 className="text-3xl font-bold text-anthracite mb-4">Siparişiniz Alındı!</h1>
                    <p className="text-gray-600 mb-8">
                        Siparişiniz başarıyla oluşturuldu. Ödemenizi tamamlamak için lütfen aşağıdaki bilgileri kullanın.
                    </p>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8 text-left">
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-1">Sipariş Numarası</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-anthracite tracking-wider">{orderNumber}</span>
                                <button onClick={handleCopy} className="text-wood-500 hover:text-wood-600 p-1">
                                    <Copy size={18} />
                                </button>
                            </div>
                            <p className="text-xs text-red-500 mt-1">
                                * Lütfen havale/EFT açıklama kısmına bu numarayı yazınız.
                            </p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <p className="text-anthracite"><span className="font-bold">Banka:</span> X Bankası</p>
                            <p className="text-anthracite"><span className="font-bold">Alıcı:</span> barkOne Mobilya Ltd. Şti.</p>
                            <p className="text-anthracite"><span className="font-bold">IBAN:</span> TR00 0000 0000 0000 0000 0000 00</p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="inline-block bg-wood-500 hover:bg-wood-600 text-white font-medium py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
