'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    Loader2,
    TrendingUp,
    Sparkles,
    ArrowUpRight,
    Users,
    CheckCircle,
    type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type OrderItem = {
    _id?: string;
    productId?: string;
    productName?: string;
    quantity?: number;
    price?: number;
};

type OrderSummary = {
    _id: string;
    orderNumber?: string;
    customer?: {
        name?: string;
        surname?: string;
    };
    totalAmount?: number;
    status?: string;
    createdAt?: string;
    items?: OrderItem[];
};

type TopProduct = {
    name: string;
    quantity: number;
    revenue: number;
};

type RevenuePoint = {
    date: string;
    amount: number;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [revenueTrend, setRevenueTrend] = useState<RevenuePoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            // Fetch products
            const productsRes = await fetch('/api/products');
            const productsData: unknown = await productsRes.json();
            const products = Array.isArray(productsData)
                ? productsData
                : Array.isArray((productsData as { data?: unknown[] })?.data)
                    ? (productsData as { data: unknown[] }).data
                    : [];

            // Fetch orders
            const ordersRes = await fetch('/api/orders');
            const ordersPayload: unknown = await ordersRes.json();
            const ordersArray = Array.isArray((ordersPayload as { data?: unknown[] })?.data)
                ? (ordersPayload as { data: unknown[] }).data
                : Array.isArray(ordersPayload)
                    ? ordersPayload
                    : [];
            const orders = ordersArray as OrderSummary[];

            // Calculate stats
            const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
            const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                pendingOrders,
                totalRevenue,
            });

            // Get recent orders (last 5)
            const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime());
            setRecentOrders(sortedOrders.slice(0, 5));

            // Aggregate top products
            const aggregate: Record<string, TopProduct> = {};
            sortedOrders.forEach((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                items.forEach((item) => {
                    const product = (item as OrderItem & { product?: { _id?: string; name?: string; price?: number } })?.product;
                    const key = product?._id ?? (item as OrderItem)?.productId ?? (item as OrderItem)?.productName ?? Math.random().toString(36);
                    const name = product?.name ?? (item as OrderItem)?.productName ?? 'Bilinmeyen Ürün';
                    const quantity = Number((item as OrderItem)?.quantity ?? 0);
                    const price = Number((item as OrderItem)?.price ?? product?.price ?? 0);

                    if (!aggregate[key]) {
                        aggregate[key] = {
                            name,
                            quantity: 0,
                            revenue: 0,
                        };
                    }

                    aggregate[key].quantity += quantity;
                    aggregate[key].revenue += quantity * price;
                });
            });
            setTopProducts(
                Object.values(aggregate)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
            );

            // Revenue trend (last 7 days)
            const revenueMap = new Map<string, number>();
            sortedOrders.forEach((order) => {
                const dateKey = new Date(order.createdAt ?? Date.now()).toISOString().slice(0, 10);
                const current = revenueMap.get(dateKey) ?? 0;
                revenueMap.set(dateKey, current + Number(order.totalAmount ?? 0));
            });
            setRevenueTrend(
                Array.from(revenueMap.entries())
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .slice(-7)
                    .map(([date, amount]) => ({
                        date: new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
                        amount,
                    }))
            );

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const run = async () => {
            await fetchDashboardData();
        };

        void run();
    }, [fetchDashboardData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-wood-500" size={40} />
            </div>
        );
    }

    const trendDelta = revenueTrend.length >= 2
        ? revenueTrend[revenueTrend.length - 1].amount - revenueTrend[revenueTrend.length - 2].amount
        : 0;

    const maxRevenue = revenueTrend.length > 0
        ? Math.max(...revenueTrend.map((item) => item.amount)) || 1
        : 1;

    const quickActions: Array<{ label: string; description: string; href: string; icon: LucideIcon }> = [
        {
            label: 'Yeni Ürün Ekle',
            description: 'Yeni raf modelleriyle koleksiyonu genişletin',
            href: '/admin/products/new',
            icon: Sparkles,
        },
        {
            label: 'İndirim Planı Oluştur',
            description: 'Haftalık kampanyanızı planlayın',
            href: '/admin/products', // Placeholder
            icon: TrendingUp,
        },
        {
            label: 'Stok Kontrolü',
            description: 'Hızlı stok dengelemesi yapın',
            href: '/admin/products', // Placeholder
            icon: CheckCircle,
        },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Hero Section */}
            <Card className="border-slate-200/60 bg-white shadow-xl">
                <CardContent className="p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 w-fit">
                                Yönetim Paneli
                            </Badge>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-light text-slate-900 sm:text-3xl md:text-4xl">
                                    barkOne Performans Özeti
                                </h1>
                                <p className="text-sm text-slate-600 md:text-base">
                                    Satış, sipariş ve ürün akışınızı tek panelden takip edin. Aşağıdaki önerilerle yönetin, gerektiğinde detay sayfalarına geçin.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild className="bg-slate-900 hover:bg-slate-800 w-full sm:w-auto">
                                    <Link href="/admin/orders" className="flex items-center gap-2 justify-center">
                                        Siparişleri Yönet
                                        <ArrowUpRight size={16} />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild className="w-full sm:w-auto">
                                    <Link href="/admin/products">
                                        Ürün Ekle
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <Card className="border-slate-200/50 bg-white/70 shadow-lg w-full lg:w-auto">
                            <CardContent className="p-4 md:p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bugünkü Gelir</p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">
                                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalRevenue / 30 || 0)}
                                        </p>
                                        <Badge variant={trendDelta >= 0 ? "default" : "destructive"} className="mt-3">
                                            <TrendingUp size={14} className="mr-1" />
                                            {trendDelta >= 0 ? '+' : ''}{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(trendDelta)}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Yeni Müşteri</p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">{recentOrders.length}</p>
                                        <Badge variant="secondary" className="mt-3 bg-blue-50 text-blue-600 hover:bg-blue-100">
                                            <Users size={14} className="mr-1" />
                                            Bu ay
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Toplam Ürün</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Toplam Sipariş</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <ShoppingCart className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Bekleyen Sipariş</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</p>
                            </div>
                            <div className="rounded-full bg-amber-100 p-3">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Toplam Gelir</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalRevenue)}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <DollarSign className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Chart and Top Products */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Gelir Eğrisi</h2>
                                <p className="text-sm text-slate-600">Son 7 gün için günlük tahsilat</p>
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                <TrendingUp size={14} className="mr-1" />
                                Trend
                            </Badge>
                        </div>
                        <div className="h-[220px]">
                            {revenueTrend.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">Henüz gelir verisi yok</div>
                            ) : (
                                <div className="flex h-full items-end gap-3">
                                    {revenueTrend.map((point) => (
                                        <div key={point.date} className="flex-1">
                                            <div className="mb-2 h-full rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-slate-600"
                                                    style={{ height: `${Math.max((point.amount / maxRevenue) * 100, 6)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 text-center">{point.date}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Öne Çıkan Ürünler</h2>
                                <p className="text-sm text-slate-600">Gelire göre ilk 5 ürün</p>
                            </div>
                            <Sparkles size={18} className="text-slate-600" />
                        </div>
                        <div className="space-y-4">
                            {topProducts.length === 0 ? (
                                <p className="text-sm text-slate-400">Henüz ürün satışı bulunmuyor.</p>
                            ) : (
                                topProducts.map((product) => (
                                    <div key={product.name} className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50/50 px-4 py-3 text-sm text-slate-900">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-xs text-slate-500">{product.quantity} adet</p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.revenue)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders and Quick Actions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Son Siparişler</h2>
                                <p className="text-sm text-slate-600">Güncel sipariş özetiniz</p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/admin/orders" className="flex items-center gap-2">
                                    Tümünü Gör
                                    <ArrowUpRight size={14} />
                                </Link>
                            </Button>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="rounded-lg border border-slate-200/70 bg-slate-50 py-12 text-center text-sm text-slate-400">
                                Henüz sipariş yok
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-slate-200/70 bg-white">
                                <table className="w-full min-w-[600px] text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Sipariş</th>
                                            <th className="px-4 py-3 text-left font-medium">Müşteri</th>
                                            <th className="px-4 py-3 text-left font-medium">Tutar</th>
                                            <th className="px-4 py-3 text-left font-medium">Durum</th>
                                            <th className="px-4 py-3 text-left font-medium">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order._id} className="border-t border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900">#{order.orderNumber}</td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {order.customer?.name} {order.customer?.surname}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalAmount ?? 0)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            order.status === 'pending'
                                                                ? 'secondary'
                                                                : order.status === 'paid'
                                                                    ? 'default'
                                                                    : order.status === 'shipped'
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                        }
                                                        className={cn(
                                                            order.status === 'pending' && 'bg-amber-100 text-amber-700',
                                                            order.status === 'paid' && 'bg-emerald-100 text-emerald-700',
                                                            order.status === 'shipped' && 'bg-blue-100 text-blue-700'
                                                        )}
                                                    >
                                                        {order.status === 'pending'
                                                            ? 'Bekliyor'
                                                            : order.status === 'paid'
                                                                ? 'Ödendi'
                                                                : order.status === 'shipped'
                                                                    ? 'Kargoda'
                                                                    : (order.status ?? 'Bilinmiyor')}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Quick Actions */}
                <Card className="border-slate-200/60 bg-white shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">Hızlı İşlemler</h2>
                            <p className="text-sm text-slate-600">En çok kullanılan panellere tek dokunuş</p>
                        </div>
                        <div className="space-y-3">
                            {quickActions.map((action) => (
                                <Button
                                    key={action.label}
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start text-left h-auto p-4 hover:bg-slate-50"
                                >
                                    <Link href={action.href} className="flex items-center gap-3">
                                        <div className="rounded-full bg-slate-100 p-2">
                                            <action.icon className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{action.label}</p>
                                            <p className="text-sm text-slate-600">{action.description}</p>
                                        </div>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
