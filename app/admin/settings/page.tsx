'use client';

import NextImage from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Save, Upload, Trash2, RefreshCcw, Sparkles, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { upload } from '@vercel/blob/client';

const compressImage = (file: File, maxWidth = 3840, quality = 0.92): Promise<File> => {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new window.Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        resolve(new File([blob], newName, { type: 'image/webp' }));
                    } else {
                        resolve(file);
                    }
                }, 'image/webp', quality);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};

type SiteSettings = Record<string, any>;

const SETTINGS_TABS = [
    { id: 'brand', label: 'Marka' },
    { id: 'homepage', label: 'Anasayfa' },
    { id: 'products', label: 'Ürünler Sayfası' },
    { id: 'contact', label: 'İletişim Sayfası' },
    { id: 'about', label: 'Hakkımızda Sayfası' },
    { id: 'company', label: 'Şirket Bilgileri' },
    { id: 'bank', label: 'Banka Bilgileri' },
];

const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Görsel verisi okunamadı'));
            }
        };
        reader.onerror = () => reject(reader.error ?? new Error('Görsel verisi okunamadı'));
        reader.readAsDataURL(file);
    });

type ImageUploaderProps = {
    label: string;
    helper?: string;
    value?: string;
    onUpload: (file: File) => Promise<void> | void;
    onRemove: () => void;
    isUploading?: boolean;
};

function ImageUploader({ label, helper, value, onUpload, onRemove, isUploading }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const processFile = async (file?: File | null) => {
        if (!file) return;
        await onUpload(file);
    };

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        await processFile(files[0]);
        event.target.value = '';
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        await processFile(file);
    };

    const dropzoneClasses = `relative mt-6 overflow-hidden rounded-[28px] border-2 border-dashed transition-all duration-300 ${isDragging
        ? 'border-wood-500/90 bg-gradient-to-br from-wood-100/80 via-white to-wood-50 shadow-[0_26px_80px_-40px_rgba(214,162,88,0.55)]'
        : 'border-stone-200/80 bg-white/80 hover:border-wood-400/70 hover:bg-wood-50/50'
        }`;

    return (
        <section className="rounded-[24px] border border-stone-200 bg-wood-50/40 p-6 shadow-[0_18px_60px_-45px_rgba(15,15,15,0.45)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/70 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                        {label}
                    </span>
                    {helper && <p className="text-sm text-stone-500 max-w-xl">{helper}</p>}
                </div>
                <div className="flex gap-3">
                    <label className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-wood-600 hover:bg-wood-600 cursor-pointer">
                        <Upload size={16} /> Görsel Yükle
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleInputChange} />
                    </label>
                    {value && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 transition-all hover:border-rose-200 hover:text-rose-500"
                        >
                            <Trash2 size={14} /> Kaldır
                        </button>
                    )}
                </div>
            </div>
            <div
                className={dropzoneClasses}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,162,88,0.12),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(139,92,52,0.08),transparent_70%)]" />
                {value ? (
                    <div className="relative z-10 h-[260px] w-full">
                        <NextImage
                            src={value}
                            alt={`${label} önizleme`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                            unoptimized
                        />
                        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/75 px-4 py-2 text-xs font-medium uppercase tracking-[0.32em] text-wood-500 shadow-[0_18px_48px_-32px_rgba(15,15,15,0.45)]">
                            <Upload size={16} /> Yeni görsel sürükleyip bırakarak güncelleyebilirsiniz
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                                <Loader2 className="h-6 w-6 animate-spin text-wood-500" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative z-10 flex h-[260px] w-full flex-col items-center justify-center gap-4 text-stone-500">
                        <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${isDragging ? 'border-wood-400 bg-white/80 text-wood-500 shadow-[0_20px_50px_-30px_rgba(214,162,88,0.6)]' : 'border-stone-200 bg-white/70 text-wood-400'
                            } transition-all duration-300`}>
                            <Upload size={24} />
                        </span>
                        <div className="text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-600">Dosya seçin veya bırakın</p>
                            <p className="mt-2 text-xs text-stone-400">PNG, JPG, WEBP • En fazla 5MB • Şeffaf arka plan önerilir</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                            <span className="rounded-full border border-stone-200/70 bg-white/70 px-4 py-1">Sürükle & Bırak</span>
                            <span className="rounded-full border border-stone-200/70 bg-white/70 px-4 py-1">PNG • JPG • WEBP</span>
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                                <Loader2 className="h-6 w-6 animate-spin text-wood-500" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

const formatUpdatedAt = (updatedAt?: string) => {
    if (!updatedAt) return 'Henüz kaydedilmedi';
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) return 'Henüz kaydedilmedi';
    return date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('homepage');
    const [pendingUploads, setPendingUploads] = useState<Record<string, boolean>>({});
    const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error'; title: string; description?: string }[]>([]);
    const { setSettings: setGlobalSettings } = useSiteSettings();

    const labelMap: Record<string, string> = {
        siteLogoLight: 'Açık zemin logo',
        siteLogoDark: 'Koyu zemin logo',
        adminLogo: 'Admin panel logo',
        homeHeroImage: 'Anasayfa hero görseli',
        productsHeroImage: 'Ürünler hero görseli',
        contactHeroImage: 'İletişim hero görseli',
        aboutHeroImage: 'Hakkımızda hero görseli',
    };

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/settings');
            const data = await response.json();
            console.log('Admin settings fetched:', data); // Debug log
            setSettings(data);
            setGlobalSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setSettings({});
            setGlobalSettings({});
        } finally {
            setIsLoading(false);
        }
    }, [setGlobalSettings]);

    const isAnyUploading = useMemo(() => Object.values(pendingUploads).some(Boolean), [pendingUploads]);

    useEffect(() => {
        void fetchSettings();
    }, [fetchSettings]);

    const handleSave = useCallback(async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setToasts((prev) => [
                    ...prev,
                    { id: Date.now() + Math.random(), type: 'success', title: 'Ayarlar Kaydedildi', description: 'Tüm değişiklikler başarıyla uygulandı.' },
                ]);
                await fetchSettings();
            } else {
                setToasts((prev) => [
                    ...prev,
                    { id: Date.now() + Math.random(), type: 'error', title: 'Kaydetme Başarısız', description: 'Ayarlar kaydedilirken bir hata oluştu.' },
                ]);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setToasts((prev) => [
                ...prev,
                { id: Date.now() + Math.random(), type: 'error', title: 'Kaydetme Başarısız', description: 'Ayarlar kaydedilirken bir hata oluştu.' },
            ]);
        } finally {
            setIsSaving(false);
        }
    }, [fetchSettings, settings]);

    const updateSetting = useCallback((key: string, value: any) => {
        setSettings((prev) => (prev ? { ...prev, [key]: value } : { [key]: value }));
    }, []);

    const updateNestedSetting = useCallback((parentKey: string, childKey: string, value: any) => {
        setSettings((prev) => {
            if (!prev) return { [parentKey]: { [childKey]: value } };
            const parent = { ...(prev[parentKey] ?? {}) };
            parent[childKey] = value;
            return { ...prev, [parentKey]: parent };
        });
    }, []);

    const updateArrayItem = useCallback((arrayKey: string, index: number, field: string, value: any) => {
        setSettings((prev) => {
            if (!prev) return null;
            const newArray = [...(prev[arrayKey] || [])];
            // Ensure object exists at index
            if (!newArray[index]) {
                // Initialize structure based on key if needed, or just empty object
                newArray[index] = {};
            }
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayKey]: newArray };
        });
    }, []);

    const handleFile = useCallback(async (file: File, key: string, customUpdate?: (url: string) => void) => {
        try {
            setPendingUploads((prev) => ({ ...prev, [key]: true }));

            // Optimistic feedback with local URL
            const previewUrl = URL.createObjectURL(file);
            if (customUpdate) {
                customUpdate(previewUrl);
            } else {
                updateSetting(key, previewUrl);
            }

            const compressedFile = await compressImage(file);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                if (customUpdate) {
                    customUpdate(blob.url);
                } else {
                    updateSetting(key, blob.url);
                }
                setToasts((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        type: 'success',
                        title: 'Görsel Yüklendi',
                        description: `${labelMap[key] ?? 'Görsel'} başarıyla güncellendi.`,
                    },
                ]);
            } else {
                throw new Error('Yükleme başarısız');
            }
        } catch (error) {
            console.error('Görsel yüklenirken hata oluştu:', error);
            setToasts((prev) => [
                ...prev,
                {
                    id: Date.now() + Math.random(),
                    type: 'error',
                    title: 'Yükleme Başarısız',
                    description: 'Görsel yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
                },
            ]);
        }
        setPendingUploads((prev) => ({ ...prev, [key]: false }));
    }, [labelMap, updateSetting]);

    const handleRemoveImage = useCallback((key: string) => {
        updateSetting(key, '');
        setToasts((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                type: 'success',
                title: 'Görsel Kaldırıldı',
                description: `${labelMap[key] ?? 'Görsel'} varsayılan ayarlara döndürüldü.`,
            },
        ]);
    }, [labelMap, updateSetting]);

    const lastUpdatedText = useMemo(() => formatUpdatedAt(settings?.updatedAt), [settings?.updatedAt]);

    if (isLoading || !settings) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-wood-500" />
            </div>
        );
    }

    const renderBrandTab = () => (
        <div className="space-y-8">
            <ImageUploader
                label="Açık Zemin Logo"
                helper="Açık renkli arka planlarda kullanılacak PNG/SVG logo yükleyin. Önerilen boyut: 200x60 piksel."
                value={settings.siteLogoLight}
                onUpload={(file) => handleFile(file, 'siteLogoLight')}
                onRemove={() => handleRemoveImage('siteLogoLight')}
                isUploading={pendingUploads.siteLogoLight}
            />
            <ImageUploader
                label="Koyu Zemin Logo"
                helper="Koyu arka planlar için ters renkli logo yükleyin. Önerilen boyut: 200x60 piksel."
                value={settings.siteLogoDark}
                onUpload={(file) => handleFile(file, 'siteLogoDark')}
                onRemove={() => handleRemoveImage('siteLogoDark')}
            />
            <ImageUploader
                label="Admin Panel Logo"
                helper="Yönetim panelinde gösterilecek logo. Şeffaf arka planlı, kare ya da yatay görsel önerilir."
                value={settings.adminLogo}
                onUpload={(file) => handleFile(file, 'adminLogo')}
                onRemove={() => handleRemoveImage('adminLogo')}
            />
        </div>
    );

    const renderHomeTab = () => (
        <div className="space-y-8">
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Rozet</label>
                            <input
                                value={settings.homeHeroBadge ?? ''}
                                onChange={(e) => updateSetting('homeHeroBadge', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Raf Çözümleri"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Başlık</label>
                            <input
                                value={settings.homeHeroTitle ?? ''}
                                onChange={(e) => updateSetting('homeHeroTitle', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Modern duvar rafları"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Alt Başlık</label>
                        <textarea
                            value={settings.homeHeroSubtitle ?? ''}
                            onChange={(e) => updateSetting('homeHeroSubtitle', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            placeholder="Kısa açıklama"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Birincil CTA Metni</label>
                            <input
                                value={settings.homeHeroPrimaryCtaLabel ?? ''}
                                onChange={(e) => updateSetting('homeHeroPrimaryCtaLabel', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Rafları incele"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Birincil CTA URL</label>
                            <input
                                value={settings.homeHeroPrimaryCtaUrl ?? ''}
                                onChange={(e) => updateSetting('homeHeroPrimaryCtaUrl', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="/products"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">İkincil CTA Metni</label>
                            <input
                                value={settings.homeHeroSecondaryCtaLabel ?? ''}
                                onChange={(e) => updateSetting('homeHeroSecondaryCtaLabel', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Destek al"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">İkincil CTA URL</label>
                            <input
                                value={settings.homeHeroSecondaryCtaUrl ?? ''}
                                onChange={(e) => updateSetting('homeHeroSecondaryCtaUrl', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="/contact"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <ImageUploader
                label="Fallback Hero Görseli"
                helper="Eğer aşağıdaki slaytlar boşsa bu görsel tek başına gösterilir."
                value={settings.homeHeroImage}
                onUpload={(file) => handleFile(file, 'homeHeroImage')}
                onRemove={() => handleRemoveImage('homeHeroImage')}
                isUploading={pendingUploads.homeHeroImage}
            />

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-stone-400">Hero Slaytları (Carousel)</h3>
                    <button
                        onClick={() => {
                            const newSlides = [...(settings.homeHeroSlides || [])];
                            newSlides.push({
                                _id: Date.now().toString(),
                                badge: 'Yeni Slayt',
                                title: 'Yeni Başlık',
                                subtitle: 'Yeni alt başlık açıklaması',
                                image: '',
                                primaryCtaLabel: 'Keşfet',
                                primaryCtaUrl: '/products'
                            });
                            updateSetting('homeHeroSlides', newSlides);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-wood-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-wood-600"
                    >
                        <Sparkles size={14} />
                        Slayt Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {(settings.homeHeroSlides || []).map((slide: any, index: number) => (
                        <div key={slide._id || index} className="group relative rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <button
                                onClick={() => {
                                    const newSlides = settings.homeHeroSlides.filter((_: any, i: number) => i !== index);
                                    updateSetting('homeHeroSlides', newSlides);
                                }}
                                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
                            >
                                <X size={16} />
                            </button>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Slayt Rozeti</label>
                                        <input
                                            value={slide.badge || ''}
                                            onChange={(e) => {
                                                const newSlides = [...settings.homeHeroSlides];
                                                newSlides[index].badge = e.target.value;
                                                updateSetting('homeHeroSlides', newSlides);
                                            }}
                                            className="w-full rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-xs font-medium focus:border-wood-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Slayt Başlığı</label>
                                        <textarea
                                            value={slide.title || ''}
                                            onChange={(e) => {
                                                const newSlides = [...settings.homeHeroSlides];
                                                newSlides[index].title = e.target.value;
                                                updateSetting('homeHeroSlides', newSlides);
                                            }}
                                            rows={2}
                                            className="w-full rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-xs font-medium focus:border-wood-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Slayt Alt Başlığı</label>
                                        <textarea
                                            value={slide.subtitle || ''}
                                            onChange={(e) => {
                                                const newSlides = [...settings.homeHeroSlides];
                                                newSlides[index].subtitle = e.target.value;
                                                updateSetting('homeHeroSlides', newSlides);
                                            }}
                                            rows={2}
                                            className="w-full rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-xs font-medium focus:border-wood-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Slayt Görseli</label>
                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                                            {slide.image ? (
                                                <>
                                                    <NextImage
                                                        src={slide.image}
                                                        alt="Slide Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {pendingUploads[`carousel-slide-${index}`] && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            const newSlides = [...settings.homeHeroSlides];
                                                            newSlides[index].image = '';
                                                            updateSetting('homeHeroSlides', newSlides);
                                                        }}
                                                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                                                    >
                                                        <Trash2 className="text-white" size={24} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                                                    {pendingUploads[`carousel-slide-${index}`] ? (
                                                        <Loader2 className="h-8 w-8 animate-spin text-wood-500" />
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file"
                                                                id={`slide-upload-${index}`}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        void handleFile(file, `carousel-slide-${index}`, (url) => {
                                                                            const newSlides = [...settings.homeHeroSlides];
                                                                            newSlides[index].image = url;
                                                                            updateSetting('homeHeroSlides', newSlides);
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`slide-upload-${index}`}
                                                                className="cursor-pointer rounded-lg bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-stone-50"
                                                            >
                                                                Görsel Yükle
                                                            </label>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Buton Metni</label>
                                            <input
                                                value={slide.primaryCtaLabel || ''}
                                                onChange={(e) => {
                                                    const newSlides = [...settings.homeHeroSlides];
                                                    newSlides[index].primaryCtaLabel = e.target.value;
                                                    updateSetting('homeHeroSlides', newSlides);
                                                }}
                                                className="w-full rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-xs font-medium focus:border-wood-400 focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Buton Linki</label>
                                            <input
                                                value={slide.primaryCtaUrl || ''}
                                                onChange={(e) => {
                                                    const newSlides = [...settings.homeHeroSlides];
                                                    newSlides[index].primaryCtaUrl = e.target.value;
                                                    updateSetting('homeHeroSlides', newSlides);
                                                }}
                                                className="w-full rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-xs font-medium focus:border-wood-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    const renderProductsTab = () => (
        <div className="space-y-8">
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Rozet</label>
                            <input
                                value={settings.productsHeroBadge ?? ''}
                                onChange={(e) => updateSetting('productsHeroBadge', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Ürün Kataloğu"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Başlık</label>
                            <input
                                value={settings.productsHeroTitle ?? ''}
                                onChange={(e) => updateSetting('productsHeroTitle', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Tüm ürünler"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Alt Başlık</label>
                        <textarea
                            value={settings.productsHeroSubtitle ?? ''}
                            onChange={(e) => updateSetting('productsHeroSubtitle', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Açıklama</label>
                            <textarea
                                value={settings.productsHeroDescription ?? ''}
                                onChange={(e) => updateSetting('productsHeroDescription', e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Arama Placeholder</label>
                            <input
                                value={settings.productsHeroSearchPlaceholder ?? ''}
                                onChange={(e) => updateSetting('productsHeroSearchPlaceholder', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Ürün ara..."
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Boş Ekran Açıklaması</label>
                            <textarea
                                value={settings.productsEmptyStateDescription ?? ''}
                                onChange={(e) => updateSetting('productsEmptyStateDescription', e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Boş Ekran CTA</label>
                            <input
                                value={settings.productsEmptyStateCtaLabel ?? ''}
                                onChange={(e) => updateSetting('productsEmptyStateCtaLabel', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="Filtreleri temizle"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <ImageUploader
                label="Ürünler Hero Görseli"
                helper="Liste sayfasının üst alanında kullanılacak ana görseli yükleyin."
                value={settings.productsHeroImage}
                onUpload={(file) => handleFile(file, 'productsHeroImage')}
                onRemove={() => handleRemoveImage('productsHeroImage')}
                isUploading={pendingUploads.productsHeroImage}
            />
        </div>
    );

    const renderContactTab = () => (
        <div className="space-y-8">
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Rozet</label>
                            <input
                                value={settings.contactHeroBadge ?? ''}
                                onChange={(e) => updateSetting('contactHeroBadge', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Başlık</label>
                            <input
                                value={settings.contactHeroTitle ?? ''}
                                onChange={(e) => updateSetting('contactHeroTitle', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Alt Başlık</label>
                        <textarea
                            value={settings.contactHeroSubtitle ?? ''}
                            onChange={(e) => updateSetting('contactHeroSubtitle', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                </div>
            </section>

            <ImageUploader
                label="İletişim Hero Görseli"
                helper="Sol taraftaki koyu alanın arka planında görünecek görsel."
                value={settings.contactHeroImage}
                onUpload={(file) => handleFile(file, 'contactHeroImage')}
                onRemove={() => handleRemoveImage('contactHeroImage')}
                isUploading={pendingUploads.contactHeroImage}
            />

            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">Form Alanı</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Form Başlığı</label>
                        <input
                            value={settings.contactFormTitle ?? ''}
                            onChange={(e) => updateSetting('contactFormTitle', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Form Alt Başlığı</label>
                        <textarea
                            value={settings.contactFormSubtitle ?? ''}
                            onChange={(e) => updateSetting('contactFormSubtitle', e.target.value)}
                            rows={2}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">İletişim Bilgileri</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Birincil E-posta</label>
                            <input
                                value={settings.contactEmailPrimary ?? ''}
                                onChange={(e) => updateSetting('contactEmailPrimary', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Telefon</label>
                            <input
                                value={settings.contactPhone ?? ''}
                                onChange={(e) => updateSetting('contactPhone', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Adres</label>
                        <textarea
                            value={settings.contactAddress ?? ''}
                            onChange={(e) => updateSetting('contactAddress', e.target.value)}
                            rows={2}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Google Harita Embed Kodu</label>
                        <textarea
                            value={settings.contactMapEmbedUrl ?? ''}
                            onChange={(e) => updateSetting('contactMapEmbedUrl', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            placeholder="https://www.google.com/maps/embed..."
                        />
                    </div>
                </div>
            </section>
        </div>
    );

    const renderCompanyTab = () => (
        <div className="space-y-8">
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Şirket Adı</label>
                        <input
                            value={settings.companyName ?? ''}
                            onChange={(e) => updateSetting('companyName', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Şirket Açıklaması</label>
                        <textarea
                            value={settings.companyDescription ?? ''}
                            onChange={(e) => updateSetting('companyDescription', e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Şirket Telefonu (Genel)</label>
                        <input
                            value={settings.contactPhone ?? ''}
                            onChange={(e) => updateSetting('contactPhone', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            placeholder="+90 ..."
                        />
                    </div>
                </div>
            </section>
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">Sosyal Medya</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Instagram</label>
                            <input
                                value={settings.socialMedia?.instagram ?? ''}
                                onChange={(e) => updateNestedSetting('socialMedia', 'instagram', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Facebook</label>
                            <input
                                value={settings.socialMedia?.facebook ?? ''}
                                onChange={(e) => updateNestedSetting('socialMedia', 'facebook', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Twitter / X</label>
                            <input
                                value={settings.socialMedia?.twitter ?? ''}
                                onChange={(e) => updateNestedSetting('socialMedia', 'twitter', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderAboutTab = () => (
        <div className="space-y-8">
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Rozet</label>
                            <input
                                value={settings.aboutHeroBadge ?? ''}
                                onChange={(e) => updateSetting('aboutHeroBadge', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Başlık</label>
                            <input
                                value={settings.aboutHeroTitle ?? ''}
                                onChange={(e) => updateSetting('aboutHeroTitle', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Alt Başlık</label>
                        <textarea
                            value={settings.aboutHeroSubtitle ?? ''}
                            onChange={(e) => updateSetting('aboutHeroSubtitle', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Açıklama</label>
                        <textarea
                            value={settings.aboutHeroDescription ?? ''}
                            onChange={(e) => updateSetting('aboutHeroDescription', e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                </div>
            </section>
            <ImageUploader
                label="Hakkımızda Hero Görseli"
                helper="Hakkımızda sayfasının üst alanında kullanılacak ana görsel."
                value={settings.aboutHeroImage}
                onUpload={(file) => handleFile(file, 'aboutHeroImage')}
                onRemove={() => handleRemoveImage('aboutHeroImage')}
                isUploading={pendingUploads.aboutHeroImage}
            />

            {/* Stats Section */}
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">İstatistikler</h3>
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">İkon ({idx + 1})</label>
                                <input
                                    value={settings.aboutStats?.[idx]?.icon ?? ''}
                                    onChange={(e) => updateArrayItem('aboutStats', idx, 'icon', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                    placeholder="örn: Users"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Başlık ({idx + 1})</label>
                                <input
                                    value={settings.aboutStats?.[idx]?.title ?? ''}
                                    onChange={(e) => updateArrayItem('aboutStats', idx, 'title', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Açıklama ({idx + 1})</label>
                                <input
                                    value={settings.aboutStats?.[idx]?.description ?? ''}
                                    onChange={(e) => updateArrayItem('aboutStats', idx, 'description', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                    <p className="text-xs text-stone-400 italic">Mevcut ikonlar: Users, Award, Shield, Heart, Lightbulb, Building, Handshake, Star</p>
                </div>
            </section>

            {/* Values Section */}
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">Değerlerimiz</h3>
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">İkon ({idx + 1})</label>
                                <input
                                    value={settings.aboutValues?.[idx]?.icon ?? ''}
                                    onChange={(e) => updateArrayItem('aboutValues', idx, 'icon', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                    placeholder="örn: Heart"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Başlık ({idx + 1})</label>
                                <input
                                    value={settings.aboutValues?.[idx]?.title ?? ''}
                                    onChange={(e) => updateArrayItem('aboutValues', idx, 'title', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Açıklama ({idx + 1})</label>
                                <input
                                    value={settings.aboutValues?.[idx]?.description ?? ''}
                                    onChange={(e) => updateArrayItem('aboutValues', idx, 'description', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">Süreç Adımları (Nasıl Çalışıyoruz?)</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Süreç Başlığı</label>
                        <input
                            value={settings.aboutProcessTitle ?? ''}
                            onChange={(e) => updateSetting('aboutProcessTitle', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Adım {idx + 1} Başlık</label>
                                <input
                                    value={settings.aboutProcessItems?.[idx]?.title ?? ''}
                                    onChange={(e) => updateArrayItem('aboutProcessItems', idx, 'title', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Adım {idx + 1} Açıklama</label>
                                <input
                                    value={settings.aboutProcessItems?.[idx]?.description ?? ''}
                                    onChange={(e) => updateArrayItem('aboutProcessItems', idx, 'description', e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-anthracite">Alt Çağrı Alanı (CTA)</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Başlık</label>
                            <input
                                value={settings.aboutCtaTitle ?? ''}
                                onChange={(e) => updateSetting('aboutCtaTitle', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Alt Başlık</label>
                            <input
                                value={settings.aboutCtaSubtitle ?? ''}
                                onChange={(e) => updateSetting('aboutCtaSubtitle', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Birincil Buton</label>
                            <input
                                value={settings.aboutCtaPrimaryLabel ?? ''}
                                onChange={(e) => updateSetting('aboutCtaPrimaryLabel', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Birincil URL</label>
                            <input
                                value={settings.aboutCtaPrimaryHref ?? ''}
                                onChange={(e) => updateSetting('aboutCtaPrimaryHref', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">İkincil Buton</label>
                            <input
                                value={settings.aboutCtaSecondaryLabel ?? ''}
                                onChange={(e) => updateSetting('aboutCtaSecondaryLabel', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">İkincil URL</label>
                            <input
                                value={settings.aboutCtaSecondaryHref ?? ''}
                                onChange={(e) => updateSetting('aboutCtaSecondaryHref', e.target.value)}
                                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );

    const renderBankTab = () => (
        <div className="space-y-8">
            <section className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,15,15,0.35)]">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Banka Adı</label>
                        <input
                            value={settings.bankName ?? ''}
                            onChange={(e) => updateSetting('bankName', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">IBAN</label>
                        <input
                            value={settings.bankIban ?? ''}
                            onChange={(e) => updateSetting('bankIban', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-anthracite shadow-inner focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                            placeholder="TR00 0000 0000 0000 0000 0000 00"
                        />
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                        Bu bilgiler sipariş tamamlandıktan sonra müşterilere gösterilecektir. Güncel tutmayı unutmayın.
                    </div>
                </div>
            </section>
        </div>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'brand':
                return renderBrandTab();
            case 'homepage':
                return renderHomeTab();
            case 'products':
                return renderProductsTab();
            case 'contact':
                return renderContactTab();
            case 'about':
                return renderAboutTab();
            case 'company':
                return renderCompanyTab();
            case 'bank':
                return renderBankTab();
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10">
            <div className="pointer-events-none fixed inset-0 z-50 flex w-full flex-col items-end gap-3 p-6">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_30px_90px_-45px_rgba(15,15,15,0.5)] backdrop-blur transition-all duration-300 ${toast.type === 'success'
                            ? 'border-emerald-200/70 bg-emerald-50/80 text-emerald-900'
                            : 'border-rose-200/70 bg-rose-50/85 text-rose-900'
                            }`}
                    >
                        <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${toast.type === 'success'
                                ? 'border-emerald-200 bg-white text-emerald-500'
                                : 'border-rose-200 bg-white text-rose-500'
                                }`}
                        >
                            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold uppercase tracking-[0.28em]">{toast.title}</p>
                            {toast.description && <p className="mt-1 text-xs text-current/80">{toast.description}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
                            className="rounded-full border border-white/40 bg-white/60 p-1 text-current/70 transition hover:bg-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="relative overflow-hidden rounded-[32px] border border-stone-200/80 bg-linear-to-br from-white via-white to-stone-50 p-10 shadow-[0_26px_96px_-50px_rgba(15,15,15,0.25)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-wood-200/60 bg-wood-50 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.35em] text-wood-500">
                            <Sparkles size={16} /> Site Ayarları
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-light text-anthracite md:text-[38px]">İçerik Yönetimi</h1>
                            <p className="max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                                Anasayfa, ürün, iletişim ve kurumsal bölümlerin içeriklerini tek panelden düzenleyin. Görselleri artık direkt yükleyebilir, değişiklikleri tek tuşla kaydedebilirsiniz.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                            Son Kaydetme: <span className="text-stone-600">{lastUpdatedText}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 md:items-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isAnyUploading}
                            className="inline-flex items-center gap-2 rounded-full border border-wood-500/60 bg-wood-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-colors duration-300 hover:border-wood-600 hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
                            {isAnyUploading ? 'Yükleniyor...' : 'Kaydet'}
                        </button>
                        <button
                            type="button"
                            onClick={() => void fetchSettings()}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 transition-colors hover:border-wood-400 hover:text-wood-500"
                        >
                            <RefreshCcw size={14} /> Yenile
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {SETTINGS_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative overflow-hidden rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition-all duration-300 ${activeTab === tab.id
                            ? 'border-wood-500 bg-wood-500 text-white shadow-[0_18px_46px_-28px_rgba(214,162,88,0.85)]'
                            : 'border-stone-200 bg-white text-stone-500 hover:border-wood-400 hover:text-wood-500'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {renderActiveTab()}
        </div>
    );
}
