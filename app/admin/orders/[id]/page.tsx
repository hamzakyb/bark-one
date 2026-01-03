'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ArrowLeft, Mail, Phone, MapPin, ShoppingBag, CalendarDays } from 'lucide-react';

type OrderStatus = 'Pending' | 'PaymentReceived' | 'Shipped' | 'Delivered' | 'Cancelled';

type OrderItem = {
    product?: {
        name?: string;
        images?: string[];
    } | null;
    price: number;
    quantity: number;
};

type Customer = {
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
};

type Order = {
    _id: string;
    orderNumber: string;
    customer: Customer;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    paymentMethod: string;
    items: OrderItem[];
};

const STATUS_ACCENTS: Record<OrderStatus, { border: string; glow: string; gradient: string; pill: string; text: string }> = {
    Pending: {
        border: 'border-amber-200/60',
        glow: 'shadow-[0_28px_90px_-60px_rgba(251,191,36,0.55)]',
        gradient: 'from-amber-500/14 via-white/70 to-amber-200/12',
        pill: 'bg-amber-500/15 text-amber-600',
        text: 'text-amber-600',
    },
    PaymentReceived: {
        border: 'border-sky-200/60',
        glow: 'shadow-[0_28px_90px_-60px_rgba(56,189,248,0.55)]',
        gradient: 'from-sky-500/14 via-white/70 to-sky-200/12',
        pill: 'bg-sky-500/15 text-sky-600',
        text: 'text-sky-600',
    },
    Shipped: {
        border: 'border-indigo-200/60',
        glow: 'shadow-[0_28px_90px_-60px_rgba(99,102,241,0.5)]',
        gradient: 'from-indigo-500/14 via-white/70 to-indigo-200/12',
        pill: 'bg-indigo-500/15 text-indigo-600',
        text: 'text-indigo-600',
    },
    Delivered: {
        border: 'border-emerald-200/60',
        glow: 'shadow-[0_28px_90px_-60px_rgba(16,185,129,0.55)]',
        gradient: 'from-emerald-500/12 via-white/70 to-emerald-300/10',
        pill: 'bg-emerald-500/15 text-emerald-600',
        text: 'text-emerald-600',
    },
    Cancelled: {
        border: 'border-rose-200/60',
        glow: 'shadow-[0_28px_90px_-60px_rgba(244,63,94,0.5)]',
        gradient: 'from-rose-500/12 via-white/70 to-rose-200/10',
        pill: 'bg-rose-500/20 text-rose-600',
        text: 'text-rose-600',
    },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { id } = await params;
                const response = await fetch(`/api/orders/${id}`);
                const data = await response.json();
                if (data.success && data.data) {
                    setOrder(data.data as Order);
                }
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [params]);

    const updateStatus = async (status: OrderStatus) => {
        if (!order) return;
        try {
            const response = await fetch(`/api/orders/${order._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setOrder({ ...order, status });
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-wood-500" />
            </div>
        );
    }

    if (!order) {
        return <div className="py-20 text-center text-stone-500">Sipariş bulunamadı.</div>;
    }

    const accent = STATUS_ACCENTS[order.status] ?? STATUS_ACCENTS.Pending;

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-linear-to-r from-white via-white/95 to-stone-50 p-7 shadow-[0_32px_120px_-70px_rgba(15,15,15,0.4)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_900px_at_-20%_-10%,rgba(214,162,88,0.18),transparent_70%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_900px_at_120%_120%,rgba(79,70,229,0.18),transparent_70%)]" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-stone-500 transition-all hover:border-wood-400 hover:bg-wood-500/15 hover:text-wood-600"
                        >
                            <ArrowLeft size={16} />
                            Siparişlere Dön
                        </button>
                        <span className={`inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] ${accent.pill}`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-full border border-white/60 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                            Toplam: <span className={`ml-2 text-sm text-anthracite ${accent.text}`}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalAmount)}</span>
                        </div>
                        <select
                            value={order.status}
                            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
                            className="rounded-full border border-white/60 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 transition-all focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        >
                            <option value="Pending">Bekliyor</option>
                            <option value="PaymentReceived">Ödeme Alındı</option>
                            <option value="Shipped">Kargolandı</option>
                            <option value="Delivered">Teslim Edildi</option>
                            <option value="Cancelled">İptal</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <div className={`group relative overflow-hidden rounded-[28px] border ${accent.border} bg-white/90 p-6 ${accent.glow} backdrop-blur transition-all duration-300 hover:-translate-y-1`}>
                    <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accent.gradient} opacity-95`} />
                    <div className="relative space-y-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-stone-500">
                                    <ShoppingBag size={14} /> Sipariş #{order.orderNumber}
                                </div>
                                <h2 className="mt-3 text-2xl font-semibold text-anthracite drop-shadow-sm">Sipariş Özeti</h2>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                                    <CalendarDays size={14} />
                                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Toplam Tutar</p>
                                <p className={`text-3xl font-semibold text-anthracite ${accent.text}`}>
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalAmount)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col gap-4 rounded-[22px] border border-white/60 bg-white/80 p-4 shadow-[0_14px_40px_-24px_rgba(15,15,15,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-30px_rgba(15,15,15,0.3)] md:flex-row md:items-center">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/70 bg-stone-100">
                                        {item.product && item.product.images && item.product.images.length > 0 ? (
                                            <Image src={item.product.images[0]} alt={item.product.name ?? 'Ürün görseli'} fill className="object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">Görsel Yok</div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-2 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-anthracite">
                                                {item.product?.name ?? 'Silinmiş Ürün'}
                                            </p>
                                            <p>Birim: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)}</p>
                                            <p>Adet: {item.quantity}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Tutar</p>
                                            <p className="text-lg font-semibold text-anthracite">
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-[0_26px_80px_-48px_rgba(15,15,15,0.3)] backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-wood-500/12 via-white/70 to-stone-200/12" />
                        <div className="relative space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Müşteri</h3>
                            <p className="text-lg font-semibold text-anthracite">
                                {order.customer.name} {order.customer.surname}
                            </p>
                            <div className="flex flex-col gap-3 text-sm text-stone-500">
                                <a href={`mailto:${order.customer.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-wood-500">
                                    <Mail size={16} /> {order.customer.email}
                                </a>
                                <a href={`tel:${order.customer.phone}`} className="inline-flex items-center gap-2 transition-colors hover:text-wood-500">
                                    <Phone size={16} /> {order.customer.phone}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-[0_26px_80px_-48px_rgba(15,15,15,0.3)] backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-500/12 via-white/70 to-purple-200/12" />
                        <div className="relative space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Teslimat Adresi</h3>
                            <div className="flex items-start gap-3 text-sm text-stone-500">
                                <MapPin size={16} className="mt-1 shrink-0" />
                                <p>{order.customer.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-[0_26px_80px_-48px_rgba(15,15,15,0.3)] backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-500/12 via-white/70 to-sky-200/12" />
                        <div className="relative space-y-2">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Ödeme Yöntemi</h3>
                            <p className="text-sm font-semibold text-anthracite">{order.paymentMethod}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
