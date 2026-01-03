'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Plus, X, Images } from 'lucide-react';

import { uploadImage } from '@/lib/upload';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '',
        images: [] as string[],
        specifications: {
            material: '',
            dimensions: '',
            color: '',
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            specifications: {
                ...formData.specifications,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        setIsLoading(true);
        setError('');

        try {
            const uploadTasks = files.map(async (file) => {
                const result = await uploadImage(file);
                if (result.success && result.url) {
                    return result.url;
                }
                throw new Error(result.error || 'Yükleme başarısız');
            });

            const uploadedUrls = await Promise.all(uploadTasks);

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls],
            }));
        } catch (uploadError: any) {
            console.error('Görseller yüklenirken hata oluştu', uploadError);
            setError(uploadError.message || 'Görseller yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
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

    const triggerFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/products', {
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
                throw new Error(data.error || 'Ürün eklenirken bir hata oluştu');
            }

            router.push('/admin/products');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        setFormData({ ...formData, name, slug });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="relative overflow-hidden rounded-[32px] border border-stone-200/70 bg-linear-to-br from-white via-white to-stone-50 p-10 shadow-[0_32px_96px_-48px_rgba(15,15,15,0.25)]">
                <button
                    onClick={() => router.back()}
                    type="button"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-anthracite"
                >
                    <ArrowLeft size={18} />
                    Geri Dön
                </button>
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/60 bg-wood-50 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                            Ürün Yönetimi
                        </span>
                        <h1 className="text-3xl font-light text-anthracite md:text-[36px]">Yeni Ürün Ekle</h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                            Ürün bilgilerini doldurun, görselleri yükleyin ve tek tıkla koleksiyona ekleyin. Görseller artık link yerine doğrudan yüklenerek saklanır.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-wood-100 bg-white px-6 py-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">İpucu</p>
                        <p className="mt-3 text-sm text-stone-600 max-w-[220px]">
                            Yükledikten sonra görselleri sürükleyip sıralama yapamazsınız, bu yüzden tercih ettiğiniz sırayla ekleyin.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <section className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_-60px_rgba(15,15,15,0.45)]">
                    <h2 className="text-lg font-semibold text-anthracite">Ürün Bilgileri</h2>
                    <p className="mt-2 text-sm text-stone-500">Alıcıların göreceği temel içerikleri buradan düzenleyin.</p>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Ürün Adı</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                value={formData.name}
                                onChange={handleNameChange}
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
                    <p className="mt-2 text-sm text-stone-500">Operasyon ekibinin takip ettiği temel rakamları girin.</p>

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
                    <p className="mt-2 text-sm text-stone-500">Malzeme, ölçü ve renk gibi detayları doldurun.</p>

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
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/70 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                                Görsel Yükleme
                            </span>
                            <h2 className="text-lg font-semibold text-anthracite">Ürün fotoğrafları</h2>
                            <p className="max-w-xl text-sm text-stone-600">
                                Birden fazla görsel yükleyebilir, dilediğiniz görseli kaldırabilirsiniz. İlk görsel ürün listelemede kapak olarak kullanılır.
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
                                    <img
                                        src={image}
                                        alt={`Ürün görseli ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
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
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-all duration-300 hover:border-wood-600 hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ürünü Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
