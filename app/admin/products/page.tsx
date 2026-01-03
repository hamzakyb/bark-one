'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Plus, Trash2, Edit, Package, Layers, TrendingUp } from 'lucide-react';

type AdminProduct = {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();

            if (Array.isArray(data)) {
                setProducts(data);
            } else if (Array.isArray(data?.data)) {
                setProducts(data.data);
            } else {
                console.warn('Beklenmeyen ürün veri formatı:', data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const stats = useMemo(() => {
        if (!products.length) {
            return {
                total: 0,
                inStock: 0,
                averagePrice: 0,
            };
        }

        const inStock = products.filter((product: AdminProduct) => product.stock > 0).length;
        const averagePrice =
            products.reduce((acc: number, product: AdminProduct) => acc + (product.price || 0), 0) / products.length;

        return {
            total: products.length,
            inStock,
            averagePrice,
        };
    }, [products]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-10">
            <div className="relative overflow-hidden rounded-[32px] border border-stone-200/80 bg-linear-to-br from-white via-white to-stone-50 p-10 shadow-[0_26px_96px_-50px_rgba(15,15,15,0.25)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/60 bg-wood-50 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                            Ürün Yönetimi
                        </span>
                        <div>
                            <h1 className="text-3xl font-light text-anthracite md:text-[38px]">Ürün Kataloğu</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                                Tüm ürünlerinizi tek panelden yönetin. Görseller artık link yerine doğrudan yüklenebiliyor; düzenlemeleri hızlıca yapabilirsiniz.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-colors duration-300 hover:border-wood-600 hover:bg-wood-600"
                    >
                        <Plus size={18} /> Yeni Ürün Ekle
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wood-50 text-wood-500">
                            <Package size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Toplam Ürün</p>
                            <p className="mt-1 text-2xl font-light text-anthracite">{stats.total}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                            <Layers size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Stokta</p>
                            <p className="mt-1 text-2xl font-light text-anthracite">{stats.inStock}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Ortalama Fiyat</p>
                            <p className="mt-1 text-2xl font-light text-anthracite">{stats.averagePrice ? formatCurrency(stats.averagePrice) : '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[26px] border border-stone-200 bg-white/95 shadow-[0_20px_80px_-48px_rgba(20,20,20,0.35)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="sticky top-0 bg-stone-50/90 backdrop-blur border-b border-stone-200/70 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                            <tr>
                                <th className="px-6 py-4">Görsel</th>
                                <th className="px-6 py-4">Ürün</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4">Stok</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm text-stone-600">
                            {products.map((product: AdminProduct) => (
                                <tr key={product._id} className="transition-colors hover:bg-stone-50/70">
                                    <td className="px-6 py-4">
                                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                                            {product.images && product.images.length > 0 ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-stone-400">
                                                    Yok
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-anthracite">{product.name}</p>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-wood-500">{formatCurrency(product.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                            {product.stock > 0 ? `${product.stock} Adet` : 'Stokta yok'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product._id}`}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:border-wood-500/50 hover:text-wood-500"
                                                aria-label={`${product.name} ürününü düzenle`}
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:border-rose-300 hover:text-rose-500"
                                                aria-label={`${product.name} ürününü sil`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!products.length && (
                    <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center text-stone-500">
                        <Package size={32} className="text-stone-300" />
                        <p className="text-sm font-medium">Henüz ürün eklenmemiş.</p>
                        <Link
                            href="/admin/products/new"
                            className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:border-wood-600 hover:bg-wood-600"
                        >
                            <Plus size={14} /> İlk ürünü ekleyin
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
