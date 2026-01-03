'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Eye, Search, Filter, PackageCheck, CalendarDays, Wallet } from 'lucide-react';

type Order = {
    _id: string;
    orderNumber: string;
    customer: {
        name: string;
        surname: string;
        email: string;
        phone: string;
    };
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
};

type OrderStatus = 'Pending' | 'PaymentReceived' | 'Shipped' | 'Delivered' | 'Cancelled';

const STATUS_LABELS: Record<OrderStatus, string> = {
    Pending: 'Bekliyor',
    PaymentReceived: 'Ödeme Alındı',
    Shipped: 'Kargolandı',
    Delivered: 'Teslim Edildi',
    Cancelled: 'İptal',
};

const STATUS_ACCENTS: Record<OrderStatus, { border: string; glow: string; gradient: string; icon: string; pill: string }> = {
    Pending: {
        border: 'border-amber-200/60',
        glow: 'shadow-[0_24px_70px_-40px_rgba(251,191,36,0.55)]',
        gradient: 'from-amber-500/14 via-white/70 to-amber-200/12',
        icon: 'bg-amber-500/15 text-amber-600',
        pill: 'bg-amber-500/15 text-amber-600',
    },
    PaymentReceived: {
        border: 'border-sky-200/60',
        glow: 'shadow-[0_24px_70px_-40px_rgba(56,189,248,0.5)]',
        gradient: 'from-sky-500/14 via-white/70 to-sky-200/12',
        icon: 'bg-sky-500/15 text-sky-600',
        pill: 'bg-sky-500/15 text-sky-600',
    },
    Shipped: {
        border: 'border-indigo-200/60',
        glow: 'shadow-[0_24px_70px_-40px_rgba(99,102,241,0.5)]',
        gradient: 'from-indigo-500/14 via-white/70 to-indigo-200/12',
        icon: 'bg-indigo-500/15 text-indigo-500',
        pill: 'bg-indigo-500/15 text-indigo-600',
    },
    Delivered: {
        border: 'border-emerald-200/60',
        glow: 'shadow-[0_24px_70px_-40px_rgba(16,185,129,0.55)]',
        gradient: 'from-emerald-500/12 via-white/70 to-emerald-300/10',
        icon: 'bg-emerald-500/15 text-emerald-600',
        pill: 'bg-emerald-500/15 text-emerald-600',
    },
    Cancelled: {
        border: 'border-rose-200/60',
        glow: 'shadow-[0_24px_70px_-40px_rgba(244,63,94,0.45)]',
        gradient: 'from-rose-500/12 via-white/70 to-rose-200/10',
        icon: 'bg-rose-500/15 text-rose-600',
        pill: 'bg-rose-500/20 text-rose-600',
    },
};

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
    { value: 'Pending', label: STATUS_LABELS.Pending },
    { value: 'PaymentReceived', label: STATUS_LABELS.PaymentReceived },
    { value: 'Shipped', label: STATUS_LABELS.Shipped },
    { value: 'Delivered', label: STATUS_LABELS.Delivered },
    { value: 'Cancelled', label: STATUS_LABELS.Cancelled },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        void fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setOrders(data.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
            const matchesQuery = searchQuery
                ? [order.orderNumber, order.customer.name, order.customer.surname, order.customer.email]
                      .filter(Boolean)
                      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
                : true;
            return matchesStatus && matchesQuery;
        });
    }, [orders, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const pendingCount = orders.filter((order) => order.status === 'Pending').length;
        const deliveredCount = orders.filter((order) => order.status === 'Delivered').length;

        return {
            totalOrders: orders.length,
            totalAmount,
            pendingCount,
            deliveredCount,
        };
    }, [orders]);

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                await fetchOrders();
            } else {
                console.error('Sipariş durumu güncellenemedi');
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-wood-500" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="relative overflow-hidden rounded-[36px] border border-white/40 bg-linear-to-br from-white via-white to-stone-50 p-10 shadow-[0_35px_120px_-70px_rgba(15,15,15,0.35)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_900px_at_-10%_-20%,rgba(214,162,88,0.18),transparent_65%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_1100px_at_110%_120%,rgba(120,113,198,0.18),transparent_70%)]" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.38em] text-wood-500 backdrop-blur-md">
                            Sipariş Yönetimi
                        </span>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-light text-anthracite md:text-[38px]">Sipariş Takibi</h1>
                            <p className="max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                                Tüm sipariş süreçlerinizi tek ekrandan yönetin. Durum güncellemeleriyle ekibinizi senkron tutun ve müşteri iletişimini hızlandırın.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="group relative overflow-hidden rounded-[26px] border border-emerald-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(16,185,129,0.55)]">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/12 via-white/70 to-emerald-300/10 opacity-95" />
                        <div className="relative flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-600">Toplam Sipariş</p>
                                <p className="text-3xl font-semibold text-anthracite drop-shadow-sm">{stats.totalOrders}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <PackageCheck size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-[26px] border border-amber-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(245,158,11,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(245,158,11,0.55)]">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-500/14 via-white/70 to-amber-200/12 opacity-95" />
                        <div className="relative flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-600">Bekleyen</p>
                                <p className="text-3xl font-semibold text-anthracite drop-shadow-sm">{stats.pendingCount}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                <Filter size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-[26px] border border-sky-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.4)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(56,189,248,0.5)]">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-500/14 via-white/70 to-sky-200/12 opacity-95" />
                        <div className="relative flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600">Teslim Edilen</p>
                                <p className="text-3xl font-semibold text-anthracite drop-shadow-sm">{stats.deliveredCount}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <CalendarDays size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-[26px] border border-purple-200/60 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(168,85,247,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(168,85,247,0.55)]">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-500/14 via-white/70 to-purple-200/12 opacity-95" />
                        <div className="relative flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-purple-600">Toplam Ciro</p>
                                <p className="text-3xl font-semibold text-anthracite drop-shadow-sm">
                                    {stats.totalAmount
                                        ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(stats.totalAmount)
                                        : '-'}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                                <Wallet size={22} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[26px] border border-stone-200 bg-white/95 p-6 shadow-[0_20px_80px_-48px_rgba(20,20,20,0.35)]">
                <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Sipariş ara..."
                            className="w-full rounded-full border border-white/60 bg-white/70 px-12 py-3 text-sm font-medium text-anthracite shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                            Duruma göre filtrele
                        </label>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                                className="rounded-full border border-white/50 bg-white/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 transition-all focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            >
                                <option value="all">Tümü</option>
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const accent = STATUS_ACCENTS[order.status];

                        return (
                            <div
                                key={order._id}
                                className={`group relative overflow-hidden rounded-[26px] border ${accent.border} bg-white/85 p-6 ${accent.glow} backdrop-blur transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accent.gradient} opacity-95`} />
                                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="text-lg font-semibold text-anthracite transition-colors hover:text-wood-500"
                                            >
                                                {order.orderNumber}
                                            </Link>
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] ${accent.pill}`}>
                                                {STATUS_LABELS[order.status]}
                                            </span>
                                        </div>
                                        <div className="grid gap-3 text-sm text-stone-500 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400">Müşteri</p>
                                                <p className="text-sm font-medium text-anthracite">
                                                    {order.customer.name} {order.customer.surname}
                                                </p>
                                                <p className="text-xs text-stone-500">{order.customer.email}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400">Toplam Tutar</p>
                                                <p className="text-lg font-semibold text-anthracite">
                                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalAmount || 0)}
                                                </p>
                                                <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone-400">
                                                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 lg:items-end">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value as OrderStatus)}
                                            className="rounded-full border border-white/60 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 transition-all focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        >
                                            {STATUS_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <Link
                                            href={`/admin/orders/${order._id}`}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:bg-wood-500/20 hover:text-wood-600"
                                        >
                                            Detayları Gör
                                            <Eye size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {!filteredOrders.length && (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-stone-300/60 bg-white/70 px-8 py-16 text-center text-stone-500">
                            <PackageCheck size={28} className="text-stone-300" />
                            <p className="text-sm font-medium">Seçilen filtrelere uygun sipariş bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
