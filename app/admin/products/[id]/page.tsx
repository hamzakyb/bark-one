'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Plus, X, Images } from 'lucide-react';

type ProductFormData = {
    name: string;
    slug: string;
    description: string;
    price: string;
    stock: string;
    images: string[];
    specifications: {
        material: string;
        dimensions: string;
        color: string;
    };
};

import { uploadImage } from '@/lib/upload';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        specifications: {
            material: '',
            dimensions: '',
            color: '',
        },
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { id } = await params;
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();

                if (data.success) {
                    const product = data.data;
                    setFormData({
                        name: product.name ?? '',
                        slug: product.slug ?? '',
                        description: product.description ?? '',
                        price: product.price != null ? product.price.toString() : '',
                        stock: product.stock != null ? product.stock.toString() : '',
                        images: Array.isArray(product.images) ? product.images : [],
                        specifications: {
                            material: product.specifications?.material ?? '',
                            dimensions: product.specifications?.dimensions ?? '',
                            color: product.specifications?.color ?? '',
                        },
                    });
                } else {
                    setError('Ürün bulunamadı');
                }
            } catch (fetchError) {
                setError('Ürün yüklenirken hata oluştu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [params]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [name]: value,
            },
        }));
    };

    const triggerFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        setIsSaving(true);
        setError('');

        try {
            const uploadTasks = files.map(async (file) => {
                const localUrl = URL.createObjectURL(file);
                // Optimistically add to UI
                setFormData(prev => ({ ...prev, images: [...prev.images, localUrl] }));

                const formData = new FormData();
                formData.append('file', file);
                const result = await uploadImage(formData);
                if (result && result.success && result.url) {
                    // Update the localUrl with the real one
                    setFormData(prev => ({
                        ...prev,
                        images: prev.images.map(img => img === localUrl ? result.url : img)
                    }));
                    return result.url;
                }
                // Revert on failure
                setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter(img => img !== localUrl)
                }));
                throw new Error(result?.error || 'Yükleme başarısız');
            });

            await Promise.all(uploadTasks);
        } catch (uploadError: any) {
            console.error('Görseller yüklenirken hata oluştu', uploadError);
            setError(uploadError.message || 'Görseller yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSaving(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const { id } = await params;
            const response = await fetch(`/api/products/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                    images: formData.images,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ürün güncellenirken bir hata oluştu');
            }

            router.push('/admin/products');
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Ürün güncellenirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-wood-500" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-10">
            <div className="relative overflow-hidden rounded-[32px] border border-stone-200/80 bg-linear-to-br from-white via-white to-stone-50 p-10 shadow-[0_26px_96px_-50px_rgba(15,15,15,0.25)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-anthracite"
                        >
                            <ArrowLeft size={18} /> Geri Dön
                        </button>
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/60 bg-wood-50 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                                Ürün Düzenleme
                            </span>
                            <h1 className="text-3xl font-light text-anthracite md:text-[36px]">Ürün İçeriğini Güncelleyin</h1>
                            <p className="max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                                Ürün metinlerini, fiyat ve stok bilgilerini güncelleyin. Görselleri artık doğrudan yükleyebilir ve sıralamayı kolayca yönetebilirsiniz.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-wood-100 bg-white px-6 py-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Durum</p>
                        <p className="mt-3 text-sm text-stone-600 max-w-[220px]">
                            Toplam {formData.images.length} görsel mevcut. İlk görsel katalog kapağı olarak gösterilir.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <section className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_-60px_rgba(15,15,15,0.45)]">
                    <h2 className="text-lg font-semibold text-anthracite">Ürün Bilgileri</h2>
                    <p className="mt-2 text-sm text-stone-500">Alıcıların gördüğü temel alanları düzenleyin.</p>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Ürün Adı</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.slug}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Kısa Açıklama</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_-60px_rgba(15,15,15,0.45)]">
                    <h2 className="text-lg font-semibold text-anthracite">Fiyat & Stok</h2>
                    <p className="mt-2 text-sm text-stone-500">Operasyon ekibinin takip ettiği rakamları güncelleyin.</p>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Fiyat (TL)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Stok Adedi</label>
                            <input
                                type="number"
                                name="stock"
                                required
                                min="0"
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_-60px_rgba(15,15,15,0.45)]">
                    <h2 className="text-lg font-semibold text-anthracite">Teknik Özellikler</h2>
                    <p className="mt-2 text-sm text-stone-500">Malzeme, ölçü ve renk bilgilerini düzenleyin.</p>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Malzeme</label>
                            <input
                                type="text"
                                name="material"
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.specifications.material}
                                onChange={handleSpecChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Boyutlar</label>
                            <input
                                type="text"
                                name="dimensions"
                                placeholder="G x Y x D"
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.specifications.dimensions}
                                onChange={handleSpecChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Renk</label>
                            <input
                                type="text"
                                name="color"
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.specifications.color}
                                onChange={handleSpecChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-dashed border-wood-200 bg-wood-50/60 p-8 shadow-[0_24px_80px_-60px_rgba(15,15,15,0.35)]">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/70 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                                Görsel Yönetimi
                            </span>
                            <h2 className="text-lg font-semibold text-anthracite">Ürün fotoğrafları</h2>
                            <p className="max-w-xl text-sm text-stone-600">
                                Yeni görseller ekleyebilir, mevcut görselleri kaldırabilirsiniz. İlk görsel katalog kapağı olarak kullanılacaktır.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={triggerFileDialog}
                                    className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-wood-600 hover:bg-wood-600"
                                >
                                    <Plus size={16} /> Görsel Yükle
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <span className="text-xs font-medium uppercase tracking-[0.25em] text-stone-400">
                                    PNG, JPG veya WEBP önerilir.
                                </span>
                            </div>
                        </div>
                        <div className="hidden rounded-2xl border border-wood-100 bg-white px-4 py-3 text-sm text-wood-600 sm:flex sm:flex-col sm:items-center sm:justify-center">
                            <Images size={28} />
                            <span className="mt-2 font-semibold tracking-[0.25em]">Galeriniz</span>
                            <span className="text-xs text-stone-400">{formData.images.length} görsel</span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {formData.images.map((image, index) => (
                            <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                                <div className="aspect-square w-full bg-stone-100">
                                    <img src={image} alt={`Ürün görseli ${index + 1}`} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">Görsel {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500 transition-colors hover:border-red-200 hover:text-red-500"
                                    >
                                        <X size={14} /> Kaldır
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!formData.images.length && (
                            <div className="flex h-48 w-full items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white/70 text-stone-400">
                                Henüz görsel yüklenmedi.
                            </div>
                        )}
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-all duration-300 hover:border-wood-600 hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
