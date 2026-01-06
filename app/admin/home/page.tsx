'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Save,
    Loader2,
    Plus,
    Trash2,
    Sparkles,
    Image as ImageIcon,
    Layers,
    GalleryVerticalEnd,
    Quote,
    ArrowUpRight,
    Stars,
    X,
    Home,
    Upload,
    Pencil,
} from 'lucide-react';
import { upload } from '@vercel/blob/client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
const compressImage = (file: File, maxWidth = 3840, quality = 0.95): Promise<File> => {
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

import { cn } from '@/lib/utils';



type Feature = {
    title: string;
    description: string;
    icon: string;
    highlight?: string;
};

type SpotlightItem = {
    title: string;
    description: string;
    price: string;
    image: string;
    href: string;
};

type GalleryItem = {
    image: string;
    label: string;
    tag: string;
    span: string;
    aspectRatio?: string;
};

type Testimonial = {
    name: string;
    role: string;
    quote: string;
    rating: number;
};

type AboutStat = {
    icon: string;
    title: string;
    description: string;
};

type AboutValue = {
    icon: string;
    title: string;
    description: string;
};

type AboutProcessItem = {
    title: string;
    description: string;
};

type SiteSettings = {
    _id?: string;
    homeHeroBadge?: string;
    homeHeroTitle?: string;
    homeHeroSubtitle?: string;
    homeHeroImage?: string;
    homeHeroPrimaryCtaLabel?: string;
    homeHeroPrimaryCtaUrl?: string;
    homeHeroSecondaryCtaLabel?: string;
    homeHeroSecondaryCtaUrl?: string;
    homeHeroVerticalText?: string;
    homeHeroSlides?: Array<{
        badge?: string;
        title?: string;
        subtitle?: string;
        image?: string;
        primaryCtaLabel?: string;
        primaryCtaUrl?: string;
        secondaryCtaLabel?: string;
        secondaryCtaUrl?: string;
    }>;
    featuresBadge?: string;
    featuresHeading?: string;
    featuresDescription?: string;
    features?: Feature[];
    spotlightBadge?: string;
    spotlightHeading?: string;
    spotlightDescription?: string;
    spotlightCtaLabel?: string;
    spotlightCtaUrl?: string;
    spotlightItems?: SpotlightItem[];
    galleryBadge?: string;
    galleryHeading?: string;
    galleryDescription?: string;
    galleryItems?: GalleryItem[];
    companyDescription?: string;
    aboutHeroBadge?: string;
    aboutHeroTitle?: string;
    aboutHeroSubtitle?: string;
    aboutHeroImage?: string;
    aboutIntroTitle?: string;
    aboutIntroBody?: string;
    aboutIntroSecondaryBody?: string;
    aboutWorkshopTitle?: string;
    aboutWorkshopBody?: string;
    aboutStats?: AboutStat[];
    aboutValues?: AboutValue[];
    aboutProcessTitle?: string;
    aboutProcessItems?: AboutProcessItem[];
    aboutTeamBody?: string;
    aboutTeamTags?: string[];
    aboutCtaTitle?: string;
    aboutCtaBody?: string;
    aboutCtaPrimaryLabel?: string;
    aboutCtaPrimaryHref?: string;
    aboutCtaSecondaryLabel?: string;
    aboutCtaSecondaryHref?: string;
    testimonialsBadge?: string;
    testimonialsHeading?: string;
    testimonialsDescription?: string;
    testimonials?: Testimonial[];
    productsHeroBadge?: string;
    productsHeroTitle?: string;
    productsHeroSubtitle?: string;
    productsHeroDescription?: string;
    productsHeroSearchPlaceholder?: string;
    productsHeroImage?: string;
    productsEmptyStateDescription?: string;
    productsEmptyStateCtaLabel?: string;
    contactHeroBadge?: string;
    contactHeroTitle?: string;
    contactHeroSubtitle?: string;
    contactHeroDescription?: string;
    contactHeroImage?: string;
    contactCtaPrimaryLabel?: string;
    contactCtaPrimaryHref?: string;
    contactCtaSecondaryLabel?: string;
    contactCtaSecondaryHref?: string;
    contactEmailPrimary?: string;
    contactEmailSecondary?: string;
    contactPhone?: string;
    contactPhoneHours?: string;
    contactAddress?: string;
    contactSupportDescription?: string;
    contactMapEmbedUrl?: string;
};

const defaultFeature: Feature = {
    title: '',
    description: '',
    icon: 'Package',
    highlight: '',
};

const defaultSpotlightItem: SpotlightItem = {
    title: '',
    description: '',
    price: '',
    image: '',
    href: '',
};

const defaultGalleryItem: GalleryItem = {
    image: '',
    label: '',
    tag: '',
    span: 'md:col-span-1 md:row-span-1',
    aspectRatio: '',
};

const defaultTestimonial: Testimonial = {
    name: '',
    role: '',
    quote: '',
    rating: 5,
};

const defaultAboutStat: AboutStat = {
    icon: 'Sparkles',
    title: '',
    description: '',
};

const defaultAboutValue: AboutValue = {
    icon: 'Sparkles',
    title: '',
    description: '',
};

const defaultAboutProcessItem: AboutProcessItem = {
    title: '',
    description: '',
};

const ADMIN_SECTION_LINKS: { id: string; label: string; description: string; icon: LucideIcon }[] = [
    {
        id: 'home-hero',
        label: 'Anasayfa Hero',
        description: 'Hero rozeti, başlıklar ve CTA metinleri',
        icon: Home,
    },
    {
        id: 'features-section',
        label: 'Özellikler',
        description: 'Bölüm başlığı ve özellik listesi',
        icon: GalleryVerticalEnd,
    },
    {
        id: 'spotlight',
        label: 'Vitrin Kartları',
        description: 'Öne çıkan ürün kartlarını yönetin',
        icon: ImageIcon,
    },
    {
        id: 'gallery',
        label: 'İlham Galerisi',
        description: 'Galeri grid ve görsel kartlar',
        icon: Layers,
    },
    {
        id: 'testimonials',
        label: 'Referanslar',
        description: 'Müşteri yorumları ve puanlamalar',
        icon: Stars,
    },
];


export default function AdminHomePage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<string>(ADMIN_SECTION_LINKS[0]?.id ?? 'home-hero');
    const [editingModal, setEditingModal] = useState<{ type: string; index: number } | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            const response = await fetch('/api/settings');
            const data: SiteSettings = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

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
                alert('Anasayfa ayarları başarıyla kaydedildi!');
            } else {
                alert('Ayarlar kaydedilirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Ayarlar kaydedilirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    }, [settings]);

    const updateSetting = useCallback(<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
        setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    }, []);

    const addFeature = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, features: [...(prev.features ?? []), { ...defaultFeature }] } : prev));
    }, []);

    const updateFeature = useCallback((index: number, field: keyof Feature, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const features = [...(prev.features ?? [])];
            const base = features[index] ?? defaultFeature;
            features[index] = { ...base, [field]: value } as Feature;
            return { ...prev, features };
        });
    }, []);

    const removeFeature = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const features = [...(prev.features ?? [])];
            features.splice(index, 1);
            return { ...prev, features };
        });
    }, []);

    const addSpotlightItem = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, spotlightItems: [...(prev.spotlightItems ?? []), { ...defaultSpotlightItem }] } : prev));
    }, []);

    const updateSpotlightItem = useCallback((index: number, field: keyof SpotlightItem, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const items = [...(prev.spotlightItems ?? [])];
            items[index] = { ...items[index], [field]: value } as SpotlightItem;
            return { ...prev, spotlightItems: items };
        });
    }, []);

    const removeSpotlightItem = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const items = [...(prev.spotlightItems ?? [])];
            items.splice(index, 1);
            return { ...prev, spotlightItems: items };
        });
    }, []);

    const addGalleryItem = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, galleryItems: [...(prev.galleryItems ?? []), { ...defaultGalleryItem }] } : prev));
    }, []);

    const updateGalleryItem = useCallback((index: number, field: keyof GalleryItem, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const items = [...(prev.galleryItems ?? [])];
            items[index] = { ...items[index], [field]: value } as GalleryItem;
            return { ...prev, galleryItems: items };
        });
    }, []);

    const removeGalleryItem = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const items = [...(prev.galleryItems ?? [])];
            items.splice(index, 1);
            return { ...prev, galleryItems: items };
        });
    }, []);



    const addHeroSlide = useCallback(() => {
        setSettings((prev) => {
            if (!prev) return prev;
            const newSlide = {
                badge: 'Yeni Slayt',
                title: 'Yeni Başlık',
                subtitle: 'Yeni Alt Başlık',
                image: '',
                primaryCtaLabel: 'İncele',
                primaryCtaUrl: '/products',
                secondaryCtaLabel: 'İletişim',
                secondaryCtaUrl: '/contact',
            };
            return { ...prev, homeHeroSlides: [...(prev.homeHeroSlides ?? []), newSlide] };
        });
    }, []);

    const removeHeroSlide = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const slides = [...(prev.homeHeroSlides ?? [])];
            slides.splice(index, 1);
            return { ...prev, homeHeroSlides: slides };
        });
    }, []);

    const updateHeroSlide = useCallback((index: number, field: string, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const slides = [...(prev.homeHeroSlides ?? [])];
            slides[index] = { ...slides[index], [field]: value };
            return { ...prev, homeHeroSlides: slides };
        });
    }, []);

    const handleHeroSlideImageUpload = useCallback(async (index: number, file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateHeroSlide(index, 'image', previewUrl);
        try {
            const compressedFile = await compressImage(file, 4096, 0.98);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateHeroSlide(index, 'image', blob.url);
            }
        } catch (error: any) {
            console.error('Hero slayt görseli yükleme hatası:', error);
        }
    }, [updateHeroSlide]);

    const updateProductsSetting = useCallback(<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
        setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    }, []);

    const updateContactSetting = useCallback(<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
        setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    }, []);

    const handleHeroImageUpload = useCallback(async (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateSetting('homeHeroImage', previewUrl);
        try {
            const compressedFile = await compressImage(file, 4096, 0.98);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateSetting('homeHeroImage', blob.url);
            } else {
                alert('Görsel yüklenemedi');
            }
        } catch (error: any) {
            console.error('Hero görseli yüklenirken hata oluştu:', error);
            alert('Görsel yükleme hatası: ' + (error?.message || 'Bilinmeyen hata'));
        }
    }, [updateSetting]);

    const handleAboutHeroImageUpload = useCallback(async (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateSetting('aboutHeroImage', previewUrl);
        try {
            const compressedFile = await compressImage(file);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateSetting('aboutHeroImage', blob.url);
            } else {
                alert('Görsel yüklenemedi');
            }
        } catch (error) {
            console.error('Hakkımızda hero görseli yüklenirken hata oluştu:', error);
        }
    }, [updateSetting]);

    const handleProductsHeroImageUpload = useCallback(async (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateProductsSetting('productsHeroImage', previewUrl);
        try {
            const compressedFile = await compressImage(file);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateProductsSetting('productsHeroImage', blob.url);
            } else {
                alert('Görsel yüklenemedi');
            }
        } catch (error) {
            console.error('Ürünler sayfası görseli yüklenirken hata oluştu:', error);
        }
    }, [updateProductsSetting]);

    const handleContactHeroImageUpload = useCallback(async (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateContactSetting('contactHeroImage', previewUrl);
        try {
            const compressedFile = await compressImage(file);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateContactSetting('contactHeroImage', blob.url);
            } else {
                alert('Görsel yüklenemedi');
            }
        } catch (error) {
            console.error('İletişim sayfası görseli yüklenirken hata oluştu:', error);
        }
    }, [updateContactSetting]);

    const handleSpotlightImageUpload = useCallback(async (index: number, file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateSpotlightItem(index, 'image', previewUrl);
        try {
            const compressedFile = await compressImage(file);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateSpotlightItem(index, 'image', blob.url);
            } else {
                alert('Görsel yüklenemedi');
            }
        } catch (error) {
            console.error('Spotlight görseli yüklenirken hata oluştu:', error);
        }
    }, [updateSpotlightItem]);

    const handleGalleryImageUpload = useCallback(async (index: number, file: File) => {
        const previewUrl = URL.createObjectURL(file);
        updateGalleryItem(index, 'image', previewUrl);
        try {
            const compressedFile = await compressImage(file);
            const blob = await upload(compressedFile.name, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                addRandomSuffix: true,
            } as any);

            if (blob && blob.url) {
                updateGalleryItem(index, 'image', blob.url);
            } else {
                alert('Görsel yüklenemedi');
            }
        } catch (error) {
            console.error('Galeri görseli yüklenirken hata oluştu:', error);
        }
    }, [updateGalleryItem]);

    const handleGalleryBulkUpload = useCallback(async (files: FileList) => {
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const compressedFile = await compressImage(file);
                const blob = await upload(compressedFile.name, compressedFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                    addRandomSuffix: true,
                } as any);

                if (blob && blob.url) {
                    return {
                        image: blob.url,
                        label: '',
                        tag: '',
                        span: 'md:col-span-1 md:row-span-1',
                    };
                }
                return null;
            });

            const results = await Promise.all(uploadPromises);
            const validResults = results.filter((r): r is GalleryItem => r !== null);

            if (validResults.length > 0) {
                setSettings((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        galleryItems: [...(prev.galleryItems ?? []), ...validResults],
                    };
                });
            }
        } catch (error) {
            console.error('Toplu galeri yüklemesi sırasında hata oluştu:', error);
        }
    }, []);

    const addTestimonial = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, testimonials: [...(prev.testimonials ?? []), { ...defaultTestimonial }] } : prev));
    }, []);

    const updateTestimonial = useCallback((index: number, field: keyof Testimonial, value: string | number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const testimonials = [...(prev.testimonials ?? [])];
            testimonials[index] = { ...testimonials[index], [field]: value } as Testimonial;
            return { ...prev, testimonials };
        });
    }, []);

    const removeTestimonial = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const testimonials = [...(prev.testimonials ?? [])];
            testimonials.splice(index, 1);
            return { ...prev, testimonials };
        });
    }, []);

    const addAboutStat = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, aboutStats: [...(prev.aboutStats ?? []), { ...defaultAboutStat }] } : prev));
    }, []);

    const updateAboutStat = useCallback((index: number, field: keyof AboutStat, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const stats = [...(prev.aboutStats ?? [])];
            stats[index] = { ...stats[index], [field]: value } as AboutStat;
            return { ...prev, aboutStats: stats };
        });
    }, []);

    const removeAboutStat = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const stats = [...(prev.aboutStats ?? [])];
            stats.splice(index, 1);
            return { ...prev, aboutStats: stats };
        });
    }, []);

    const addAboutValue = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, aboutValues: [...(prev.aboutValues ?? []), { ...defaultAboutValue }] } : prev));
    }, []);

    const updateAboutValue = useCallback((index: number, field: keyof AboutValue, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const values = [...(prev.aboutValues ?? [])];
            values[index] = { ...values[index], [field]: value } as AboutValue;
            return { ...prev, aboutValues: values };
        });
    }, []);

    const removeAboutValue = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const values = [...(prev.aboutValues ?? [])];
            values.splice(index, 1);
            return { ...prev, aboutValues: values };
        });
    }, []);

    const addAboutProcessItem = useCallback(() => {
        setSettings((prev) => (prev ? { ...prev, aboutProcessItems: [...(prev.aboutProcessItems ?? []), { ...defaultAboutProcessItem }] } : prev));
    }, []);

    const updateAboutProcessItem = useCallback((index: number, field: keyof AboutProcessItem, value: string) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const items = [...(prev.aboutProcessItems ?? [])];
            items[index] = { ...items[index], [field]: value } as AboutProcessItem;
            return { ...prev, aboutProcessItems: items };
        });
    }, []);

    const removeAboutProcessItem = useCallback((index: number) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const items = [...(prev.aboutProcessItems ?? [])];
            items.splice(index, 1);
            return { ...prev, aboutProcessItems: items };
        });
    }, []);

    const updateAboutTeamTags = useCallback((value: string) => {
        const tags = value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        updateSetting('aboutTeamTags', tags);
    }, [updateSetting]);

    const renderSection = useCallback(
        (sectionId: string, content: () => React.ReactNode) => (activeSection === sectionId ? content() : null),
        [activeSection],
    );

    if (isLoading || !settings) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-wood-500" size={40} />
            </div>
        );
    }

    const contentItemsCount =
        (settings.features?.length ?? 0) +
        (settings.spotlightItems?.length ?? 0) +
        (settings.galleryItems?.length ?? 0) +
        (settings.testimonials?.length ?? 0);

    return (
        <div>
            {/* Modal */}
            {editingModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
                    <Card className="relative w-full max-w-2xl mx-4 mt-28 mb-10 shadow-2xl" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                        <CardContent className="p-8">
                            <Button
                                onClick={() => setEditingModal(null)}
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-4"
                            >
                                <X size={24} />
                            </Button>

                            <div className="mt-12">

                                {editingModal.type === 'home-hero' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-semibold text-slate-900">Hero Slaytları</h2>
                                                <p className="text-xs text-slate-500 mt-1">Anasayfa başında dönecek görselleri ve içerikleri buradan yönetin.</p>
                                            </div>
                                            <Button
                                                onClick={addHeroSlide}
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full border-wood-300 text-wood-600 hover:bg-wood-50"
                                            >
                                                <Plus size={16} className="mr-1" /> Slayt Ekle
                                            </Button>
                                        </div>

                                        <div className="p-6 rounded-[32px] border border-slate-200 bg-slate-50/50 space-y-4">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Dikey Dekoratif Metin (Sol Kenar)</Label>
                                            <Input
                                                value={settings.homeHeroVerticalText ?? ''}
                                                onChange={(e) => updateSetting('homeHeroVerticalText', e.target.value)}
                                                placeholder="Örn: Premium Craftsmanship"
                                                className="rounded-xl border-slate-200 focus:ring-wood-500 bg-white"
                                            />
                                            <p className="text-[10px] text-slate-400 italic">Hero bölümünün sol kenarında dikey olarak görünen yazı.</p>
                                        </div>

                                        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {(!settings?.homeHeroSlides || settings.homeHeroSlides.length === 0) && (
                                                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                                                    <div className="mx-auto size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <p className="text-slate-600 font-medium">Henüz slayt eklenmedi.</p>
                                                    <p className="text-slate-400 text-xs mt-1">Ekranın sağ üstündeki butondan yeni slayt ekleyebilirsiniz.</p>
                                                </div>
                                            )}

                                            {(settings?.homeHeroSlides ?? []).map((slide, index) => (
                                                <div key={index} className="p-6 rounded-[32px] border border-slate-200 bg-white shadow-sm space-y-6 relative group">
                                                    <div className="absolute -left-3 top-6 size-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                    <button
                                                        onClick={() => removeHeroSlide(index)}
                                                        className="absolute -right-3 -top-3 size-10 rounded-full bg-white text-rose-500 flex items-center justify-center border border-slate-100 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:scale-110 active:scale-95 z-20"
                                                        title="Slaytı Sil"
                                                    >
                                                        <X size={20} />
                                                    </button>

                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Slayt Görseli</Label>
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative aspect-[4/3] w-32 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
                                                                    {slide.image ? (
                                                                        <img src={slide.image} className="size-full object-cover" alt={`Slayt ${index + 1}`} />
                                                                    ) : (
                                                                        <div className="size-full flex items-center justify-center text-slate-300">
                                                                            <ImageIcon size={32} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <label className="flex-1 h-24 border-2 border-dashed border-slate-200 rounded-2xl hover:border-wood-300 hover:bg-wood-50/30 cursor-pointer flex flex-col items-center justify-center transition-all group/upload">
                                                                    <Upload size={20} className="text-slate-400 group-hover/upload:text-wood-500 mb-1 transition-colors" />
                                                                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Görsel Yükle</span>
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) handleHeroSlideImageUpload(index, file);
                                                                            e.target.value = '';
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 italic font-medium mt-1">Önerilen: 2000x1000px+, Yatay Format</p>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Rozet Metni</Label>
                                                                <Input
                                                                    value={slide.badge ?? ''}
                                                                    onChange={(e) => updateHeroSlide(index, 'badge', e.target.value)}
                                                                    placeholder="Örn: Yeni Koleksiyon"
                                                                    className="rounded-xl border-slate-200 focus:ring-wood-500"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Başlık</Label>
                                                                <Input
                                                                    value={slide.title ?? ''}
                                                                    onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                                                                    placeholder="Modern \n Duvar Rafları"
                                                                    className="rounded-xl border-slate-200 focus:ring-wood-500 font-medium"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Alt Başlık / Açıklama</Label>
                                                        <Textarea
                                                            value={slide.subtitle ?? ''}
                                                            onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                                                            rows={2}
                                                            placeholder="Slayt için kısa açıklama metni..."
                                                            className="rounded-xl border-slate-200 focus:ring-wood-500 resize-none"
                                                        />
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Birincil Buton (Koyu)</p>
                                                            <div className="grid gap-3">
                                                                <Input
                                                                    value={slide.primaryCtaLabel ?? ''}
                                                                    onChange={(e) => updateHeroSlide(index, 'primaryCtaLabel', e.target.value)}
                                                                    placeholder="Buton Metni"
                                                                    className="h-9 text-xs rounded-lg"
                                                                />
                                                                <Input
                                                                    value={slide.primaryCtaUrl ?? ''}
                                                                    onChange={(e) => updateHeroSlide(index, 'primaryCtaUrl', e.target.value)}
                                                                    placeholder="Buton Linki (/products)"
                                                                    className="h-9 text-xs rounded-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">İkincil Buton (Şeffaf)</p>
                                                            <div className="grid gap-3">
                                                                <Input
                                                                    value={slide.secondaryCtaLabel ?? ''}
                                                                    onChange={(e) => updateHeroSlide(index, 'secondaryCtaLabel', e.target.value)}
                                                                    placeholder="Buton Metni"
                                                                    className="h-9 text-xs rounded-lg"
                                                                />
                                                                <Input
                                                                    value={slide.secondaryCtaUrl ?? ''}
                                                                    onChange={(e) => updateHeroSlide(index, 'secondaryCtaUrl', e.target.value)}
                                                                    placeholder="Buton Linki (/contact)"
                                                                    className="h-9 text-xs rounded-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 flex gap-4">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-semibold py-6"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => { setEditingModal(null); handleSave(); }}
                                                className="flex-2 rounded-full bg-slate-900 text-white hover:bg-black transition-all font-semibold py-6 shadow-xl shadow-slate-200"
                                            >
                                                Değişiklikleri Yayınla
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'testimonial-section' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Müşteri Yorumları Ayarları</h2>
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                                    <input
                                                        type="text"
                                                        value={settings.testimonialsBadge ?? ''}
                                                        onChange={(e) => updateSetting('testimonialsBadge', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Müşteri Yorumları"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={settings.testimonialsHeading ?? ''}
                                                        onChange={(e) => updateSetting('testimonialsHeading', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Raf çözümlerini tercih edenlerin deneyimleri"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.testimonialsDescription ?? ''}
                                                    onChange={(e) => updateSetting('testimonialsDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'gallery-section' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">İlham Galerisi Ayarları</h2>
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                                    <input
                                                        type="text"
                                                        value={settings.galleryBadge ?? ''}
                                                        onChange={(e) => updateSetting('galleryBadge', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="İlham Galerisi"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={settings.galleryHeading ?? ''}
                                                        onChange={(e) => updateSetting('galleryHeading', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Mekânlarınıza ilham verin"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.galleryDescription ?? ''}
                                                    onChange={(e) => updateSetting('galleryDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'spotlight-section' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Vitrin Alanı Ayarları</h2>
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                                    <input
                                                        type="text"
                                                        value={settings.spotlightBadge ?? ''}
                                                        onChange={(e) => updateSetting('spotlightBadge', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Raf Ürünlerimiz"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={settings.spotlightHeading ?? ''}
                                                        onChange={(e) => updateSetting('spotlightHeading', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Öne çıkan duvar rafları"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.spotlightDescription ?? ''}
                                                    onChange={(e) => updateSetting('spotlightDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">CTA Metni</label>
                                                    <input
                                                        type="text"
                                                        value={settings.spotlightCtaLabel ?? ''}
                                                        onChange={(e) => updateSetting('spotlightCtaLabel', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Tüm Ürünleri Gör"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">CTA Linki</label>
                                                    <input
                                                        type="text"
                                                        value={settings.spotlightCtaUrl ?? ''}
                                                        onChange={(e) => updateSetting('spotlightCtaUrl', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="/products"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'contact-page' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">İletişim Sayfası Düzenle</h2>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Rozeti</label>
                                                <input
                                                    type="text"
                                                    value={settings.contactHeroBadge ?? ''}
                                                    onChange={(e) => updateContactSetting('contactHeroBadge', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Müşteri Destek Ekibi"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Başlık</label>
                                                <input
                                                    type="text"
                                                    value={settings.contactHeroTitle ?? ''}
                                                    onChange={(e) => updateContactSetting('contactHeroTitle', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="İletişim"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Alt Başlık</label>
                                                <textarea
                                                    value={settings.contactHeroSubtitle ?? ''}
                                                    onChange={(e) => updateContactSetting('contactHeroSubtitle', e.target.value)}
                                                    rows={2}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Sorularınız için bize ulaşın"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Açıklaması</label>
                                                <textarea
                                                    value={settings.contactHeroDescription ?? ''}
                                                    onChange={(e) => updateContactSetting('contactHeroDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Destek ekibinize dair kısa açıklama"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Metni</label>
                                                <input
                                                    type="text"
                                                    value={settings.contactCtaPrimaryLabel ?? ''}
                                                    onChange={(e) => updateContactSetting('contactCtaPrimaryLabel', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Destek ile İletişim"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Link</label>
                                                <input
                                                    type="text"
                                                    value={settings.contactCtaPrimaryHref ?? ''}
                                                    onChange={(e) => updateContactSetting('contactCtaPrimaryHref', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="#destek"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Metni</label>
                                                <input
                                                    type="text"
                                                    value={settings.contactCtaSecondaryLabel ?? ''}
                                                    onChange={(e) => updateContactSetting('contactCtaSecondaryLabel', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Randevu Talep Et"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Link</label>
                                                <input
                                                    type="text"
                                                    value={settings.contactCtaSecondaryHref ?? ''}
                                                    onChange={(e) => updateContactSetting('contactCtaSecondaryHref', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="#appointment"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Görseli</label>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {settings?.contactHeroImage && (
                                                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                            <div
                                                                className="h-full w-full bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${settings.contactHeroImage})` }}
                                                            />
                                                        </div>
                                                    )}
                                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                                        <ImageIcon size={16} />
                                                        <span>Görsel Seç</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                void handleContactHeroImageUpload(file);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                    {settings?.contactHeroImage && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => updateContactSetting('contactHeroImage', '')}
                                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover:border-red-300 hover:text-red-500"
                                                        >
                                                            Kaldır
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500">İletişim kahraman alanında kullanılacak yüksek çözünürlüklü görsel seçin.</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">İletişim Bilgileri</h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil E-posta</label>
                                                    <input
                                                        type="email"
                                                        value={settings.contactEmailPrimary ?? ''}
                                                        onChange={(e) => updateContactSetting('contactEmailPrimary', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="info@barkone.com"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil E-posta</label>
                                                    <input
                                                        type="email"
                                                        value={settings.contactEmailSecondary ?? ''}
                                                        onChange={(e) => updateContactSetting('contactEmailSecondary', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="destek@barkone.com"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Telefon</label>
                                                    <input
                                                        type="text"
                                                        value={settings.contactPhone ?? ''}
                                                        onChange={(e) => updateContactSetting('contactPhone', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="+90 555 123 45 67"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Mesai Saatleri</label>
                                                    <input
                                                        type="text"
                                                        value={settings.contactPhoneHours ?? ''}
                                                        onChange={(e) => updateContactSetting('contactPhoneHours', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Hafta içi 09:00 - 18:00"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Adres</label>
                                                    <textarea
                                                        value={settings.contactAddress ?? ''}
                                                        onChange={(e) => updateContactSetting('contactAddress', e.target.value)}
                                                        rows={2}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Mobilyacılar Sitesi, A Blok No:12, İstanbul"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Destek Açıklaması</label>
                                                    <textarea
                                                        value={settings.contactSupportDescription ?? ''}
                                                        onChange={(e) => updateContactSetting('contactSupportDescription', e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Sipariş süreçleri ve teslimat planlaması için destek ekibimiz yanınızda..."
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-3">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Google Harita Embed Kodu</label>
                                                    <textarea
                                                        value={settings.contactMapEmbedUrl ?? ''}
                                                        onChange={(e) => updateContactSetting('contactMapEmbedUrl', e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="https://www.google.com/maps/embed..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'about-page' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Hakkımızda Bölümü Düzenle</h2>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Rozeti</label>
                                                <input
                                                    type="text"
                                                    value={settings.aboutHeroBadge ?? ''}
                                                    onChange={(e) => updateSetting('aboutHeroBadge', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Hakkımızda"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Başlık</label>
                                                <input
                                                    type="text"
                                                    value={settings.aboutHeroTitle ?? ''}
                                                    onChange={(e) => updateSetting('aboutHeroTitle', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Marka vaadinizi yazın"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Alt Başlık</label>
                                                <textarea
                                                    value={settings.aboutHeroSubtitle ?? ''}
                                                    onChange={(e) => updateSetting('aboutHeroSubtitle', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Kısa tanıtım metniniz"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Görseli</label>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {settings?.aboutHeroImage && (
                                                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                            <div
                                                                className="h-full w-full bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${settings.aboutHeroImage})` }}
                                                            />
                                                        </div>
                                                    )}
                                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                                        <ImageIcon size={16} />
                                                        <span>Görsel Seç</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                if (!files || files.length === 0) return;
                                                                void handleAboutHeroImageUpload(files[0]);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                    {settings?.aboutHeroImage && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => updateSetting('aboutHeroImage', '')}
                                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover:border-red-300 hover:text-red-500"
                                                        >
                                                            Kaldır
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500">Arka plan hero görseliniz yüksek çözünürlüklü olmalıdır.</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Intro Başlığı</label>
                                                <input
                                                    type="text"
                                                    value={settings.aboutIntroTitle ?? ''}
                                                    onChange={(e) => updateSetting('aboutIntroTitle', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Biz Kimiz?"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Atölye Başlığı</label>
                                                <input
                                                    type="text"
                                                    value={settings.aboutWorkshopTitle ?? ''}
                                                    onChange={(e) => updateSetting('aboutWorkshopTitle', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Atölyemiz"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Intro Birincil Metin</label>
                                                <textarea
                                                    value={settings.aboutIntroBody ?? ''}
                                                    onChange={(e) => updateSetting('aboutIntroBody', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Markanızın hikayesini anlatın"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Intro İkincil Metin</label>
                                                <textarea
                                                    value={settings.aboutIntroSecondaryBody ?? ''}
                                                    onChange={(e) => updateSetting('aboutIntroSecondaryBody', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Operasyon ve üretim süreçlerinizi ekleyin"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Atölye Açıklaması</label>
                                                <textarea
                                                    value={settings.aboutWorkshopBody ?? ''}
                                                    onChange={(e) => updateSetting('aboutWorkshopBody', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Üretim detaylarını paylaşın"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'features-section' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-semibold text-anthracite">Özellikler Bölümü Ayarları</h2>
                                        </div>

                                        <div className="space-y-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Bölüm Başlığı</h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                                    <input
                                                        type="text"
                                                        value={settings.featuresBadge ?? ''}
                                                        onChange={(e) => updateSetting('featuresBadge', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="BarkOne Raf Sistemleri"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={settings.featuresHeading ?? ''}
                                                        onChange={(e) => updateSetting('featuresHeading', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Güven veren raflar..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.featuresDescription ?? ''}
                                                    onChange={(e) => updateSetting('featuresDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Dayanıklı malzeme..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Özellik Listesi</h3>
                                                    <p className="text-xs text-stone-500">Müşterilerinize sunduğunuz temel avantajlar.</p>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        addFeature();
                                                        // We rely on the layout to just add it, user can click edit. 
                                                        // Or ideally we switch to edit mode for the last item.
                                                        // For simplicity, we just add it and let them click edit.
                                                    }}
                                                    className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                                >
                                                    <Plus size={14} /> Ekle
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {(!settings.features || settings.features.length === 0) && (
                                                    <div className="py-8 text-center text-sm text-stone-400 border border-dashed border-stone-300 rounded-2xl">
                                                        Henüz özellik eklenmedi.
                                                    </div>
                                                )}
                                                {settings.features?.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 rounded-2xl border border-stone-200/60 bg-white p-4 shadow-sm transition-all hover:border-wood-200 hover:shadow-md">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                                                            <span className="font-serif font-bold">{idx + 1}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-stone-900 truncate">{feature.title || 'İsimsiz Özellik'}</p>
                                                            <p className="text-xs text-stone-500 truncate">{feature.description || 'Açıklama yok'}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                onClick={() => setEditingModal({ type: 'feature-edit', index: idx })}
                                                                className="h-8 rounded-full border border-stone-200 px-3 text-xs font-medium text-stone-600 hover:bg-stone-50"
                                                                variant="ghost"
                                                            >
                                                                Düzenle
                                                            </Button>
                                                            <Button
                                                                onClick={() => removeFeature(idx)}
                                                                className="h-8 w-8 rounded-full border border-red-100 text-red-500 hover:bg-red-50"
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'feature-edit' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Özellik Düzenle</h2>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={settings.features?.[editingModal.index]?.title ?? ''}
                                                    onChange={(e) => updateFeature(editingModal.index, 'title', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkon</label>
                                                <input
                                                    type="text"
                                                    value={settings.features?.[editingModal.index]?.icon ?? ''}
                                                    onChange={(e) => updateFeature(editingModal.index, 'icon', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Leaf, ShieldCheck..."
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Vurgulu Not</label>
                                                <input
                                                    type="text"
                                                    value={settings.features?.[editingModal.index]?.highlight ?? ''}
                                                    onChange={(e) => updateFeature(editingModal.index, 'highlight', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="2 yıl montaj desteği gibi kısa vurgu"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.features?.[editingModal.index]?.description ?? ''}
                                                    onChange={(e) => updateFeature(editingModal.index, 'description', e.target.value)}
                                                    rows={4}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal({ type: 'features-section', index: 0 })}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Geri Dön
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'spotlight' && settings?.spotlightItems?.[editingModal.index] && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Ürün Kartı Düzenle</h2>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={settings.spotlightItems[editingModal.index].title ?? ''}
                                                    onChange={(e) => updateSpotlightItem(editingModal.index, 'title', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Fiyat</label>
                                                <input
                                                    type="text"
                                                    value={settings.spotlightItems[editingModal.index].price ?? ''}
                                                    onChange={(e) => updateSpotlightItem(editingModal.index, 'price', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.spotlightItems[editingModal.index].description ?? ''}
                                                    onChange={(e) => updateSpotlightItem(editingModal.index, 'description', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Link</label>
                                                <input
                                                    type="text"
                                                    value={settings.spotlightItems[editingModal.index].href ?? ''}
                                                    onChange={(e) => updateSpotlightItem(editingModal.index, 'href', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'gallery-section' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-semibold text-anthracite">Galeri Alanı Yönetimi</h2>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Alan Rozeti</label>
                                                <input
                                                    type="text"
                                                    value={settings.galleryBadge ?? ''}
                                                    onChange={(e) => updateSetting('galleryBadge', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={settings.galleryHeading ?? ''}
                                                    onChange={(e) => updateSetting('galleryHeading', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={settings.galleryDescription ?? ''}
                                                    onChange={(e) => updateSetting('galleryDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-stone-200">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Galeri Görselleri</h3>
                                                    <Button
                                                        onClick={addGalleryItem}
                                                        className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                                    >
                                                        <Plus size={14} /> Ekle
                                                    </Button>
                                                </div>

                                                <div className="grid gap-3">
                                                    {(settings.galleryItems ?? []).map((item, index) => (
                                                        <div key={index} className="flex items-center gap-4 rounded-2xl border border-stone-200/60 bg-white/60 p-3 group hover:border-wood-300/50 hover:bg-white transition-all">
                                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 border border-stone-100">
                                                                {item.image ? (
                                                                    <div
                                                                        className="h-full w-full bg-cover bg-center"
                                                                        style={{ backgroundImage: `url(${item.image})` }}
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-stone-300">
                                                                        <ImageIcon size={20} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="truncate text-sm font-medium text-stone-700">{item.label || 'Başlıksız Görsel'}</p>
                                                                <p className="truncate text-xs text-stone-400">{item.tag || 'Etiket yok'}</p>
                                                            </div>
                                                            <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    onClick={() => setEditingModal({ type: 'gallery', index })}
                                                                    className="h-10 w-10 rounded-full border border-stone-200 bg-white text-stone-500 hover:border-wood-400 hover:text-wood-500 hover:bg-wood-50 p-0"
                                                                >
                                                                    <Pencil size={16} />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => removeGalleryItem(index)}
                                                                    className="h-10 w-10 rounded-full border border-stone-200 bg-white text-stone-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 p-0"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'gallery' && settings?.galleryItems?.[editingModal.index] && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Galeri Kartı Düzenle</h2>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Görsel</label>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {settings.galleryItems[editingModal.index].image && (
                                                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                            <div
                                                                className="h-full w-full bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${settings.galleryItems[editingModal.index].image})` }}
                                                            />
                                                        </div>
                                                    )}
                                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                                        <ImageIcon size={16} />
                                                        <span>Görsel Seç</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                void handleGalleryImageUpload(editingModal.index, file);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Etiket (Label)</label>
                                                <input
                                                    type="text"
                                                    value={settings.galleryItems[editingModal.index].label ?? ''}
                                                    onChange={(e) => updateGalleryItem(editingModal.index, 'label', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet (Tag)</label>
                                                <input
                                                    type="text"
                                                    value={settings.galleryItems[editingModal.index].tag ?? ''}
                                                    onChange={(e) => updateGalleryItem(editingModal.index, 'tag', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Grid Span</label>
                                                <input
                                                    type="text"
                                                    value={settings.galleryItems[editingModal.index].span ?? ''}
                                                    onChange={(e) => updateGalleryItem(editingModal.index, 'span', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="md:col-span-2 md:row-span-2"
                                                />
                                                <p className="text-[10px] text-stone-400">Örnek: md:col-span-2 md:row-span-2 (Büyük), md:col-span-1 md:row-span-1 (Küçük)</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal({ type: 'gallery-section', index: 0 })}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Geri Dön
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {editingModal.type === 'testimonial' && settings?.testimonials?.[editingModal.index] && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-anthracite">Yorum Düzenle</h2>
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Ad</label>
                                                <input
                                                    type="text"
                                                    value={settings.testimonials[editingModal.index].name ?? ''}
                                                    onChange={(e) => updateTestimonial(editingModal.index, 'name', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rol</label>
                                                <input
                                                    type="text"
                                                    value={settings.testimonials[editingModal.index].role ?? ''}
                                                    onChange={(e) => updateTestimonial(editingModal.index, 'role', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Yorum</label>
                                                <textarea
                                                    value={settings.testimonials[editingModal.index].quote ?? ''}
                                                    onChange={(e) => updateTestimonial(editingModal.index, 'quote', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Puanlama (1-5)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={settings.testimonials[editingModal.index].rating ?? 5}
                                                    onChange={(e) => updateTestimonial(editingModal.index, 'rating', parseInt(e.target.value))}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingModal(null)}
                                                className="flex-1 rounded-full border border-stone-300/70 bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-stone-400 hover:bg-white"
                                            >
                                                Kapat
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingModal(null);
                                                    handleSave();
                                                }}
                                                className="flex-1 rounded-full border border-wood-400/70 bg-wood-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-500 hover:bg-wood-100"
                                            >
                                                Kaydet
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            <div className="space-y-10">
                <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#151821] via-[#1f232c] to-[#0b0d10] px-8 py-10 text-slate-100 shadow-[0_45px_160px_-100px_rgba(8,10,15,0.85)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_900px_at_15%_10%,rgba(148,163,184,0.18),transparent_70%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_1100px_at_75%_-5%,rgba(100,116,139,0.16),transparent_75%)]" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-5">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200/80">
                                Admin • Anasayfa
                            </span>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-light text-slate-50 md:text-[40px]">Anasayfa İçerik Kontrol Merkezi</h1>
                                <p className="text-sm font-light leading-relaxed text-slate-300 md:text-base">
                                    Hero alanlarından ilham galerisine kadar tüm vitrin içeriklerini tek bakışta yönetin. Değişiklik yapın, kaydedin ve siteye saniyeler içinde yansıtın.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-300/50 bg-slate-900/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition-all duration-300 hover:border-slate-200 hover:bg-slate-800/80 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    {isSaving ? 'Kaydediliyor' : 'Değişiklikleri Kaydet'}
                                </Button>
                                <a
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition-all duration-300 hover:border-slate-300"
                                >
                                    Anasayfa
                                </a>
                                <Button variant="outline" asChild>
                                    <a
                                        href="/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2"
                                    >
                                        <span className="text-black">Siteyi Görüntüle</span>
                                        <ArrowUpRight size={16} />
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 rounded-[28px] border border-white/15 bg-white/5 p-5 text-sm text-slate-200 shadow-[0_35px_120px_-110px_rgba(6,8,12,0.9)] backdrop-blur-xl sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-[0_18px_40px_-32px_rgba(7,9,13,0.65)]">
                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-300">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-100">
                                        <Sparkles size={18} />
                                    </span>
                                    Bölümler
                                </div>
                                <p className="mt-4 text-2xl font-semibold tracking-tight text-white">6 Alan</p>
                                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">HOME ekranında aktif</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-[0_18px_40px_-32px_rgba(7,9,13,0.65)]">
                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-300">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-100">
                                        <Layers size={18} />
                                    </span>
                                    Öğeler
                                </div>
                                <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{contentItemsCount}</p>
                                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Kart & içerik sayısı</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-slate-100 shadow-[0_32px_120px_-110px_rgba(8,10,15,0.8)]">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold uppercase tracking-[0.35em] text-black">Hızlı Gezinti</h2>
                            <p className="text-sm text-black">Düzenlemek istediğiniz bölüme tek tıkla ulaşın.</p>
                        </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {ADMIN_SECTION_LINKS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <Button
                                    key={section.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveSection(section.id);

                                        if (section.id === 'home-hero') {
                                            setEditingModal({ type: 'home-hero', index: 0 });
                                            return;
                                        }

                                        if (section.id === 'about-page') {
                                            setEditingModal({ type: 'about-page', index: 0 });
                                            return;
                                        }

                                        if (section.id === 'contact-page') {
                                            setEditingModal({ type: 'contact-page', index: 0 });
                                            return;
                                        }

                                        if (section.id === 'features-section') {
                                            setEditingModal({ type: 'features-section', index: 0 });
                                            return;
                                        }

                                        if (section.id === 'spotlight') {
                                            setEditingModal({ type: 'spotlight-section', index: 0 });
                                            return;
                                        }

                                        if (section.id === 'gallery') {
                                            setEditingModal({ type: 'gallery-section', index: 0 });
                                            return;
                                        }

                                        if (section.id === 'testimonials') {
                                            setEditingModal({ type: 'testimonial-section', index: 0 });
                                            return;
                                        }
                                    }}
                                    aria-pressed={isActive}
                                    className={`group flex h-full flex-col items-start gap-3 rounded-2xl border px-5 py-4 text-left text-slate-200 transition-all ${isActive
                                        ? 'border-white/30 bg-slate-900/80 text-white shadow-[0_20px_45px_-25px_rgba(8,10,15,0.65)]'
                                        : 'border-white/10 bg-slate-900/50 hover:border-white/25 hover:bg-slate-900/70'
                                        }`}
                                >
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${isActive ? 'border-white/30 bg-white/15 text-white' : 'border-white/15 bg-white/10 text-slate-100'
                                        } transition-colors group-hover:border-white/30 group-hover:text-white`}>
                                        <Icon size={18} />
                                    </span>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold uppercase tracking-[0.3em]">{section.label}</p>
                                        <p className="text-xs text-slate-400">{section.description}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                        }`}>
                                        Bölüme git
                                        <ArrowUpRight size={14} />
                                    </span>
                                </Button>
                            );
                        })}
                    </div>

                    <section
                        id="home-hero"
                        className="hidden mt-12 relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,162,88,0.12),transparent_70%)]" />
                        <div className="relative space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-anthracite">Hero Bölümü</h2>
                                    <p className="text-sm text-stone-500">Hero rozetinden CTA metinlerine kadar vitrinin ilk izlenimini kişiselleştirin.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                    <input
                                        type="text"
                                        value={settings.homeHeroBadge ?? ''}
                                        onChange={(e) => updateSetting('homeHeroBadge', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Raf Çözümleri"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Arka Plan Görseli</label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {settings?.homeHeroImage && (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                <div
                                                    className="h-full w-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${settings.homeHeroImage})` }}
                                                />
                                            </div>
                                        )}
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                            <ImageIcon size={16} />
                                            <span>Görsel Seç</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    void handleHeroImageUpload(file);
                                                    e.target.value = '';
                                                }}
                                            />
                                        </label>
                                        {settings?.homeHeroImage && (
                                            <Button
                                                type="button"
                                                onClick={() => updateSetting('homeHeroImage', '')}
                                                className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover:border-red-300 hover:text-red-500"
                                            >
                                                Kaldır
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-stone-500">Bilgisayarınızdan görsel seçtiğinizde otomatik olarak kaydedilecek.</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                <input
                                    type="text"
                                    value={settings.homeHeroTitle ?? ''}
                                    onChange={(e) => updateSetting('homeHeroTitle', e.target.value)}
                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                    placeholder="Modern Duvar Rafları"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Alt Başlık</label>
                                <textarea
                                    value={settings.homeHeroSubtitle ?? ''}
                                    onChange={(e) => updateSetting('homeHeroSubtitle', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                    placeholder="Minimalist tasarımlarla yaşam alanlarınıza şıklık katın"
                                ></textarea>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Metni</label>
                                    <input
                                        type="text"
                                        value={settings.homeHeroPrimaryCtaLabel ?? ''}
                                        onChange={(e) => updateSetting('homeHeroPrimaryCtaLabel', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Rafları İncele"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Linki</label>
                                    <input
                                        type="text"
                                        value={settings.homeHeroPrimaryCtaUrl ?? ''}
                                        onChange={(e) => updateSetting('homeHeroPrimaryCtaUrl', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="/products"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Metni</label>
                                    <input
                                        type="text"
                                        value={settings.homeHeroSecondaryCtaLabel ?? ''}
                                        onChange={(e) => updateSetting('homeHeroSecondaryCtaLabel', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Destek Al"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold-uppercase tracking-[0.35em] text-stone-500">İkincil CTA Linki</label>
                                    <input
                                        type="text"
                                        value={settings.homeHeroSecondaryCtaUrl ?? ''}
                                        onChange={(e) => updateSetting('homeHeroSecondaryCtaUrl', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="/contact"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="about-page"
                        className="hidden relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,162,88,0.12),transparent_70%)]" />
                        <div className="relative space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-anthracite">Hakkımızda Bölümü</h2>
                                    <p className="text-sm text-stone-500">Hakkımızda sayfasının ilk izlenimini kişiselleştirin.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Rozeti</label>
                                    <input
                                        type="text"
                                        value={settings.aboutHeroBadge ?? ''}
                                        onChange={(e) => updateSetting('aboutHeroBadge', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Hakkımızda"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Başlık</label>
                                    <input
                                        type="text"
                                        value={settings.aboutHeroTitle ?? ''}
                                        onChange={(e) => updateSetting('aboutHeroTitle', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Marka vaadinizi yazın"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Alt Başlık</label>
                                    <textarea
                                        value={settings.aboutHeroSubtitle ?? ''}
                                        onChange={(e) => updateSetting('aboutHeroSubtitle', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Kısa tanıtım metniniz"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Görseli</label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {settings?.aboutHeroImage && (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                <div
                                                    className="h-full w-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${settings.aboutHeroImage})` }}
                                                />
                                            </div>
                                        )}
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                            <ImageIcon size={16} />
                                            <span>Görsel Seç</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (!files || files.length === 0) return;
                                                    void handleAboutHeroImageUpload(files[0]);
                                                    e.target.value = '';
                                                }}
                                            />
                                        </label>
                                        {settings?.aboutHeroImage && (
                                            <Button
                                                type="button"
                                                onClick={() => updateSetting('aboutHeroImage', '')}
                                                className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover:border-red-300 hover:text-red-500"
                                            >
                                                Kaldır
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-stone-500">Arka plan hero görseliniz yüksek çözünürlüklü olmalıdır.</p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Intro Başlığı</label>
                                    <input
                                        type="text"
                                        value={settings.aboutIntroTitle ?? ''}
                                        onChange={(e) => updateSetting('aboutIntroTitle', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Biz Kimiz?"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Atölye Başlığı</label>
                                    <input
                                        type="text"
                                        value={settings.aboutWorkshopTitle ?? ''}
                                        onChange={(e) => updateSetting('aboutWorkshopTitle', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Atölyemiz"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Intro Birincil Metin</label>
                                    <textarea
                                        value={settings.aboutIntroBody ?? ''}
                                        onChange={(e) => updateSetting('aboutIntroBody', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Markanızın hikayesini anlatın"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Intro İkincil Metin</label>
                                    <textarea
                                        value={settings.aboutIntroSecondaryBody ?? ''}
                                        onChange={(e) => updateSetting('aboutIntroSecondaryBody', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Operasyon ve üretim süreçlerinizi ekleyin"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Atölye Açıklaması</label>
                                    <textarea
                                        value={settings.aboutWorkshopBody ?? ''}
                                        onChange={(e) => updateSetting('aboutWorkshopBody', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Üretim detaylarını paylaşın"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">İstatistik Kartları</h3>
                                        <p className="text-xs text-stone-500">Rakamlarla güven veren kısa bilgiler ekleyin.</p>
                                    </div>
                                    <Button
                                        onClick={addAboutStat}
                                        className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                    >
                                        <Plus size={14} /> İstatistik
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {(settings.aboutStats ?? []).map((stat, index) => (
                                        <div key={`about-stat-${index}`} className="rounded-[24px] border border-stone-200/70 bg-white/80 p-5 shadow-[0_24px_70px_-60px_rgba(15,15,15,0.45)]">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İstatistik {index + 1}</h4>
                                                <Button
                                                    onClick={() => removeAboutStat(index)}
                                                    className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                    title="Kartı Sil"
                                                >
                                                    <Trash2 size={15} />
                                                </Button>
                                            </div>
                                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkon</label>
                                                    <input
                                                        type="text"
                                                        value={stat.icon ?? ''}
                                                        onChange={(e) => updateAboutStat(index, 'icon', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Ruler, Users..."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={stat.title ?? ''}
                                                        onChange={(e) => updateAboutStat(index, 'title', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-1">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                    <textarea
                                                        value={stat.description ?? ''}
                                                        onChange={(e) => updateAboutStat(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(settings.aboutStats?.length ?? 0) === 0 && (
                                        <div className="rounded-[20px] border border-dashed border-stone-300/70 bg-white/70 px-6 py-8 text-center text-sm text-stone-400">
                                            Henüz istatistik kartı eklenmedi.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Değer Kartları</h3>
                                        <p className="text-xs text-stone-500">Markanızın vaadini vurgulayan kartlar oluşturun.</p>
                                    </div>
                                    <Button
                                        onClick={addAboutValue}
                                        className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                    >
                                        <Plus size={14} /> Değer
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {(settings.aboutValues ?? []).map((value, index) => (
                                        <div key={`about-value-${index}`} className="rounded-[24px] border border-stone-200/70 bg-white/80 p-5 shadow-[0_24px_70px_-60px_rgba(15,15,15,0.45)]">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Değer {index + 1}</h4>
                                                <Button
                                                    onClick={() => removeAboutValue(index)}
                                                    className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                    title="Kartı Sil"
                                                >
                                                    <Trash2 size={15} />
                                                </Button>
                                            </div>
                                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkon</label>
                                                    <input
                                                        type="text"
                                                        value={value.icon ?? ''}
                                                        onChange={(e) => updateAboutValue(index, 'icon', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                        placeholder="Leaf, Sparkles..."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={value.title ?? ''}
                                                        onChange={(e) => updateAboutValue(index, 'title', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus-ring-wood-100"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-1">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                    <textarea
                                                        value={value.description ?? ''}
                                                        onChange={(e) => updateAboutValue(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(settings.aboutValues?.length ?? 0) === 0 && (
                                        <div className="rounded-[20px] border border-dashed border-stone-300/70 bg-white/70 px-6 py-8 text-center text-sm text-stone-400">
                                            Henüz değer kartı eklenmedi.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Süreç Adımları</h3>
                                        <p className="text-xs text-stone-500">Müşteri yolculuğunu anlatan adımları sıralayın.</p>
                                    </div>
                                    <Button
                                        onClick={addAboutProcessItem}
                                        className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                    >
                                        <Plus size={14} /> Adım
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {(settings.aboutProcessItems ?? []).map((item, index) => (
                                        <div key={`about-process-${index}`} className="rounded-[24px] border border-stone-200/70 bg-white/80 p-5 shadow-[0_24px_70px_-60px_rgba(15,15,15,0.45)]">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Adım {index + 1}</h4>
                                                <Button
                                                    onClick={() => removeAboutProcessItem(index)}
                                                    className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                    title="Adımı Sil"
                                                >
                                                    <Trash2 size={15} />
                                                </Button>
                                            </div>
                                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                    <input
                                                        type="text"
                                                        value={item.title ?? ''}
                                                        onChange={(e) => updateAboutProcessItem(index, 'title', e.target.value)}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                    <textarea
                                                        value={item.description ?? ''}
                                                        onChange={(e) => updateAboutProcessItem(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(settings.aboutProcessItems?.length ?? 0) === 0 && (
                                        <div className="rounded-[20px] border border-dashed border-stone-300/70 bg-white/70 px-6 py-8 text-center text-sm text-stone-400">
                                            Henüz süreç adımı eklenmedi.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Takım & CTA</h3>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Takım Metni</label>
                                    <textarea
                                        value={settings.aboutTeamBody ?? ''}
                                        onChange={(e) => updateSetting('aboutTeamBody', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Takım Etiketleri (virgülle ayırın)</label>
                                    <input
                                        type="text"
                                        value={(settings.aboutTeamTags ?? []).join(', ')}
                                        onChange={(e) => updateAboutTeamTags(e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="İç Mimar, Marangoz..."
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">CTA Başlığı</label>
                                        <input
                                            type="text"
                                            value={settings.aboutCtaTitle ?? ''}
                                            onChange={(e) => updateSetting('aboutCtaTitle', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">CTA Ana Metni</label>
                                        <textarea
                                            value={settings.aboutCtaBody ?? ''}
                                            onChange={(e) => updateSetting('aboutCtaBody', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Metni</label>
                                        <input
                                            type="text"
                                            value={settings.aboutCtaPrimaryLabel ?? ''}
                                            onChange={(e) => updateSetting('aboutCtaPrimaryLabel', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="İletişime Geç"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Link</label>
                                        <input
                                            type="text"
                                            value={settings.aboutCtaPrimaryHref ?? ''}
                                            onChange={(e) => updateSetting('aboutCtaPrimaryHref', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="/contact"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Metni</label>
                                        <input
                                            type="text"
                                            value={settings.aboutCtaSecondaryLabel ?? ''}
                                            onChange={(e) => updateSetting('aboutCtaSecondaryLabel', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="Ürünleri Gör"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Link</label>
                                        <input
                                            type="text"
                                            value={settings.aboutCtaSecondaryHref ?? ''}
                                            onChange={(e) => updateSetting('aboutCtaSecondaryHref', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="/products"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="contact-page"
                        className="hidden relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,18,25,0.08),transparent_70%)]" />
                        <div className="relative space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-anthracite">İletişim Sayfası</h2>
                                    <p className="text-sm text-stone-500">İletişim kahramanı, CTA butonları ve iletişim bilgilerini güncelleyin.</p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Rozeti</label>
                                    <input
                                        type="text"
                                        value={settings.contactHeroBadge ?? ''}
                                        onChange={(e) => updateContactSetting('contactHeroBadge', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Müşteri Destek Ekibi"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Başlık</label>
                                    <input
                                        type="text"
                                        value={settings.contactHeroTitle ?? ''}
                                        onChange={(e) => updateContactSetting('contactHeroTitle', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="İletişim"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Alt Başlık</label>
                                    <textarea
                                        value={settings.contactHeroSubtitle ?? ''}
                                        onChange={(e) => updateContactSetting('contactHeroSubtitle', e.target.value)}
                                        rows={2}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Sorularınız için bize ulaşın"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Açıklaması</label>
                                    <textarea
                                        value={settings.contactHeroDescription ?? ''}
                                        onChange={(e) => updateContactSetting('contactHeroDescription', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Destek ekibinize dair kısa açıklama"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Metni</label>
                                    <input
                                        type="text"
                                        value={settings.contactCtaPrimaryLabel ?? ''}
                                        onChange={(e) => updateContactSetting('contactCtaPrimaryLabel', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Destek ile İletişim"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil CTA Link</label>
                                    <input
                                        type="text"
                                        value={settings.contactCtaPrimaryHref ?? ''}
                                        onChange={(e) => updateContactSetting('contactCtaPrimaryHref', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="#destek"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Metni</label>
                                    <input
                                        type="text"
                                        value={settings.contactCtaSecondaryLabel ?? ''}
                                        onChange={(e) => updateContactSetting('contactCtaSecondaryLabel', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="Randevu Talep Et"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil CTA Link</label>
                                    <input
                                        type="text"
                                        value={settings.contactCtaSecondaryHref ?? ''}
                                        onChange={(e) => updateContactSetting('contactCtaSecondaryHref', e.target.value)}
                                        className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        placeholder="#appointment"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Hero Görseli</label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {settings?.contactHeroImage && (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                <div
                                                    className="h-full w-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${settings.contactHeroImage})` }}
                                                />
                                            </div>
                                        )}
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                            <ImageIcon size={16} />
                                            <span>Görsel Seç</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (!files || files.length === 0) return;
                                                    void handleContactHeroImageUpload(files[0]);
                                                    e.target.value = '';
                                                }}
                                            />
                                        </label>
                                        {settings?.contactHeroImage && (
                                            <Button
                                                type="button"
                                                onClick={() => updateContactSetting('contactHeroImage', '')}
                                                className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover:border-red-300 hover:text-red-500"
                                            >
                                                Kaldır
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-stone-500">İletişim kahraman alanında kullanılacak yüksek çözünürlüklü görsel seçin.</p>
                                </div>
                            </div>

                            <div className="grid gap-4 rounded-[24px] border border-stone-200/70 bg-stone-50/80 p-6">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">İletişim Bilgileri</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Birincil E-posta</label>
                                        <input
                                            type="email"
                                            value={settings.contactEmailPrimary ?? ''}
                                            onChange={(e) => updateContactSetting('contactEmailPrimary', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="info@barkone.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkincil E-posta</label>
                                        <input
                                            type="email"
                                            value={settings.contactEmailSecondary ?? ''}
                                            onChange={(e) => updateContactSetting('contactEmailSecondary', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="destek@barkone.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Telefon</label>
                                        <input
                                            type="text"
                                            value={settings.contactPhone ?? ''}
                                            onChange={(e) => updateContactSetting('contactPhone', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="+90 555 123 45 67"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Mesai Saatleri</label>
                                        <input
                                            type="text"
                                            value={settings.contactPhoneHours ?? ''}
                                            onChange={(e) => updateContactSetting('contactPhoneHours', e.target.value)}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="Hafta içi 09:00 - 18:00"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Adres</label>
                                        <textarea
                                            value={settings.contactAddress ?? ''}
                                            onChange={(e) => updateContactSetting('contactAddress', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="Mobilyacılar Sitesi, A Blok No:12, İstanbul"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Destek Açıklaması</label>
                                        <textarea
                                            value={settings.contactSupportDescription ?? ''}
                                            onChange={(e) => updateContactSetting('contactSupportDescription', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="Sipariş süreçleri ve teslimat planlaması için destek ekibimiz yanınızda..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Google Harita Embed Kodu</label>
                                        <textarea
                                            value={settings.contactMapEmbedUrl ?? ''}
                                            onChange={(e) => updateContactSetting('contactMapEmbedUrl', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                            placeholder="https://www.google.com/maps/embed..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="products-showcase"
                        className="hidden grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
                    >
                        <div className="space-y-6">
                            <div className="relative mt-8 overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,162,88,0.12),transparent_75%)]" />
                                <div className="relative space-y-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-anthracite">Özellikler Başlığı</h2>
                                            <p className="text-sm text-stone-500">Öne çıkan avantajlar blokunun genel metinlerini düzenleyin.</p>
                                        </div>
                                        <Button
                                            onClick={addFeature}
                                            className="inline-flex items-center gap-2 rounded-full border border-wood-300/50 bg-wood-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-wood-600 transition-all hover:border-wood-400"
                                        >
                                            <Plus size={14} /> Özellik
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                                <input
                                                    type="text"
                                                    value={settings.featuresBadge ?? ''}
                                                    onChange={(e) => updateSetting('featuresBadge', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="BarkOne Raf Sistemleri"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={settings.featuresHeading ?? ''}
                                                    onChange={(e) => updateSetting('featuresHeading', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Güven veren raflar..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                            <textarea
                                                value={settings.featuresDescription ?? ''}
                                                onChange={(e) => updateSetting('featuresDescription', e.target.value)}
                                                rows={3}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Dayanıklı malzeme..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(settings.features ?? []).map((feature, index) => (
                                    <div key={`feature-${index}`} onClick={() => setEditingModal({ type: 'feature', index })} className="relative cursor-pointer overflow-hidden rounded-[28px] border border-stone-200/60 bg-white/75 p-6 shadow-[0_25px_80px_-70px_rgba(15,15,15,0.7)] transition-all hover:shadow-[0_25px_80px_-50px_rgba(15,15,15,0.9)] backdrop-blur">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Özellik {index + 1}</h3>
                                                <p className="text-xs text-stone-400">Raf avantajı kartı</p>
                                            </div>
                                            <Button
                                                onClick={() => removeFeature(index)}
                                                className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                title="Özelliği Sil"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={feature.title ?? ''}
                                                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İkon</label>
                                                <input
                                                    type="text"
                                                    value={feature.icon ?? ''}
                                                    onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Leaf, ShieldCheck..."
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Vurgulu Not</label>
                                                <input
                                                    type="text"
                                                    value={feature.highlight ?? ''}
                                                    onChange={(e) => updateFeature(index, 'highlight', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="2 yıl montaj desteği gibi kısa vurgu"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={feature.description ?? ''}
                                                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(settings.features?.length ?? 0) === 0 && (
                                    <div className="rounded-[28px] border border-dashed border-stone-300/60 bg-white/70 px-6 py-10 text-center text-sm text-stone-400">
                                        Henüz özellik kartı eklenmedi.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section
                        id="spotlight"
                        className="hidden grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
                    >
                        <div className="space-y-6">
                            <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,162,88,0.12),transparent_75%)]" />
                                <div className="relative space-y-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-anthracite">Öne Çıkan Ürün Alanı</h2>
                                            <p className="text-sm text-stone-500">Ürün vurgusunun başlık ve CTA detaylarını düzenleyin.</p>
                                        </div>
                                        <Button
                                            onClick={addSpotlightItem}
                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                        >
                                            <Plus size={14} /> Ürün
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                            <input
                                                type="text"
                                                value={settings.spotlightBadge ?? ''}
                                                onChange={(e) => updateSetting('spotlightBadge', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Raf Ürünlerimiz"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                            <input
                                                type="text"
                                                value={settings.spotlightHeading ?? ''}
                                                onChange={(e) => updateSetting('spotlightHeading', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Öne çıkan duvar rafları"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                        <textarea
                                            value={settings.spotlightDescription ?? ''}
                                            onChange={(e) => updateSetting('spotlightDescription', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">CTA Metni</label>
                                            <input
                                                type="text"
                                                value={settings.spotlightCtaLabel ?? ''}
                                                onChange={(e) => updateSetting('spotlightCtaLabel', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Tüm Ürünleri Gör"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">CTA Linki</label>
                                            <input
                                                type="text"
                                                value={settings.spotlightCtaUrl ?? ''}
                                                onChange={(e) => updateSetting('spotlightCtaUrl', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="/products"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(settings.spotlightItems ?? []).map((item, index) => (
                                    <div key={`spotlight-${index}`} onClick={() => setEditingModal({ type: 'spotlight', index })} className="relative cursor-pointer overflow-hidden rounded-[28px] border border-stone-200/60 bg-white/75 p-6 shadow-[0_25px_80px_-70px_rgba(15,15,15,0.7)] transition-all hover:shadow-[0_25px_80px_-50px_rgba(15,15,15,0.9)] backdrop-blur">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Ürün {index + 1}</h3>
                                                <p className="text-xs text-stone-400">Öne çıkan ürün kartı</p>
                                            </div>
                                            <Button
                                                onClick={() => removeSpotlightItem(index)}
                                                className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                title="Ürünü Sil"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={item.title ?? ''}
                                                    onChange={(e) => updateSpotlightItem(index, 'title', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Fiyat</label>
                                                <input
                                                    type="text"
                                                    value={item.price ?? ''}
                                                    onChange={(e) => updateSpotlightItem(index, 'price', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="12.990 TL"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                                <textarea
                                                    value={item.description ?? ''}
                                                    onChange={(e) => {
                                                        updateSpotlightItem(index, 'description', e.target.value);
                                                    }}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Ürün Görseli</label>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {item.image && (
                                                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                            <div
                                                                className="h-full w-full bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${item.image})` }}
                                                            />
                                                        </div>
                                                    )}
                                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                                        <ImageIcon size={16} />
                                                        <span>Yükle</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                if (!files || files.length === 0) return;
                                                                void handleSpotlightImageUpload(index, files[0]);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                    {item.image && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => updateSpotlightItem(index, 'image', '')}
                                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover:border-red-300 hover:text-red-500"
                                                        >
                                                            Kaldır
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500">Dosyayı seçtiğinizde veriler kayıtlara eklenecek.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Ürün Linki</label>
                                                <input
                                                    type="text"
                                                    value={item.href ?? ''}
                                                    onChange={(e) => updateSpotlightItem(index, 'href', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="/product/slug"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(settings.spotlightItems?.length ?? 0) === 0 && (
                                    <div className="rounded-[28px] border border-dashed border-stone-300/60 bg-white/70 px-6 py-10 text-center text-sm text-stone-400">
                                        Öne çıkan ürün kartı eklenmedi.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section
                        id="gallery"
                        className="hidden grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
                    >
                        <div className="space-y-6">
                            <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(214,162,88,0.12),transparent_75%)]" />
                                <div className="relative space-y-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-anthracite">Galeri Alanı</h2>
                                            <p className="text-sm text-stone-500">Mekân görselleri için rozet, metin ve görsel kartlarını düzenleyin.</p>
                                        </div>
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                            <ImageIcon size={16} />
                                            <span>Toplu Yükle</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (!files || files.length === 0) return;
                                                    void handleGalleryBulkUpload(files);
                                                    e.target.value = '';
                                                }}
                                            />
                                        </label>
                                        <Button
                                            onClick={addGalleryItem}
                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                        >
                                            <Plus size={16} /> Boş Kart
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                            <input
                                                type="text"
                                                value={settings.galleryBadge ?? ''}
                                                onChange={(e) => updateSetting('galleryBadge', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Galeri"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                            <input
                                                type="text"
                                                value={settings.galleryHeading ?? ''}
                                                onChange={(e) => updateSetting('galleryHeading', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Yaşam alanınıza ilham veren sahneler"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                        <textarea
                                            value={settings.galleryDescription ?? ''}
                                            onChange={(e) => updateSetting('galleryDescription', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(settings.galleryItems ?? []).map((item, index) => (
                                    <div key={`gallery-${index}`} onClick={() => setEditingModal({ type: 'gallery', index })} className="relative cursor-pointer overflow-hidden rounded-[28px] border border-stone-200/60 bg-white/75 p-6 shadow-[0_25px_80px_-70px_rgba(15,15,15,0.7)] transition-all hover:shadow-[0_25px_80px_-50px_rgba(15,15,15,0.9)] backdrop-blur">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Görsel {index + 1}</h3>
                                                <p className="text-xs text-stone-400">Grid kartı</p>
                                            </div>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeGalleryItem(index);
                                                }}
                                                className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                title="Kartı Sil"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Galeri Görseli</label>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {item.image && (
                                                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-100">
                                                            <div
                                                                className="h-full w-full bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${item.image})` }}
                                                            />
                                                        </div>
                                                    )}
                                                    <label onClick={(e) => e.stopPropagation()} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500">
                                                        <ImageIcon size={16} />
                                                        <span>Yükle</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                if (!files || files.length === 0) return;
                                                                void handleGalleryImageUpload(index, files[0]);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                    {item.image && (
                                                        <Button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateGalleryItem(index, 'image', '');
                                                            }}
                                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-400 transition-all hover-border-red-300 hover:text-red-500"
                                                        >
                                                            Kaldır
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500">Galeri görsellerini doğrudan buradan ekleyin.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Grid Span</label>
                                                <input
                                                    type="text"
                                                    value={item.span ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateGalleryItem(index, 'span', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="md:col-span-2 md:row-span-2"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Etiket</label>
                                                <input
                                                    type="text"
                                                    value={item.label ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateGalleryItem(index, 'label', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Oturma Odası"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                                <input
                                                    type="text"
                                                    value={item.tag ?? ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateGalleryItem(index, 'tag', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Raf Ürünleri"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(settings.galleryItems?.length ?? 0) === 0 && (
                                    <div className="rounded-[28px] border border-dashed border-stone-300/60 bg-white/70 px-6 py-10 text-center text-sm text-stone-400">
                                        Galeri görseli eklenmedi.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section
                        id="testimonials"
                        className="hidden grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
                    >
                        <div className="space-y-6">
                            <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,162,88,0.12),transparent_75%)]" />
                                <div className="relative space-y-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-anthracite">Müşteri Yorumları</h2>
                                            <p className="text-sm text-stone-500">Derecelendirmeler ve alıntıları düzenleyin.</p>
                                        </div>
                                        <Button
                                            onClick={addTestimonial}
                                            className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-stone-600 transition-all hover:border-wood-400 hover:text-wood-500"
                                        >
                                            <Quote size={16} /> Yorum
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rozet</label>
                                            <input
                                                type="text"
                                                value={settings.testimonialsBadge ?? ''}
                                                onChange={(e) => updateSetting('testimonialsBadge', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Müşteri Yorumları"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Başlık</label>
                                            <input
                                                type="text"
                                                value={settings.testimonialsHeading ?? ''}
                                                onChange={(e) => updateSetting('testimonialsHeading', e.target.value)}
                                                className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                placeholder="Raf çözümlerini tercih edenlerin deneyimleri"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Açıklama</label>
                                        <textarea
                                            value={settings.testimonialsDescription ?? ''}
                                            onChange={(e) => updateSetting('testimonialsDescription', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(settings.testimonials ?? []).map((testimonial, index) => (
                                    <div key={`testimonial-${index}`} onClick={() => setEditingModal({ type: 'testimonial', index })} className="relative cursor-pointer overflow-hidden rounded-[28px] border border-stone-200/60 bg-white/75 p-6 shadow-[0_25px_80px_-70px_rgba(15,15,15,0.7)] transition-all hover:shadow-[0_25px_80px_-50px_rgba(15,15,15,0.9)] backdrop-blur">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Yorum {index + 1}</h3>
                                                <p className="text-xs text-stone-400">Müşteri alıntısı</p>
                                            </div>
                                            <Button
                                                onClick={() => removeTestimonial(index)}
                                                className="rounded-full border border-red-200/70 bg-red-50/70 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                                title="Yorumu Sil"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">İsim</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.name ?? ''}
                                                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Rol</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.role ?? ''}
                                                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                    placeholder="Mimar"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Puan</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    value={testimonial.rating ?? 5}
                                                    onChange={(e) => updateTestimonial(index, 'rating', Number(e.target.value))}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Alıntı</label>
                                                <textarea
                                                    value={testimonial.quote ?? ''}
                                                    onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-3 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(settings.testimonials?.length ?? 0) === 0 && (
                                    <div className="rounded-[28px] border border-dashed border-stone-300/60 bg-white/70 px-6 py-10 text-center text-sm text-stone-400">
                                        Henüz müşteri yorumu eklenmedi.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/85 p-8 shadow-[0_45px_140px_-110px_rgba(15,15,15,0.75)] backdrop-blur">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,162,88,0.12),transparent_75%)]" />
                            <div className="relative space-y-5">
                                <div>
                                    <h2 className="text-lg font-semibold text-anthracite">Şirket Açıklaması</h2>
                                    <p className="text-sm text-stone-500">Anasayfa alt bilgisindeki kısa marka metnini düzenleyin.</p>
                                </div>
                                <textarea
                                    value={settings.companyDescription ?? ''}
                                    onChange={(e) => updateSetting('companyDescription', e.target.value)}
                                    rows={6}
                                    className="w-full rounded-[24px] border border-stone-200/70 bg-white/80 px-4 py-4 text-sm text-anthracite focus:border-wood-400 focus:outline-none focus:ring-2 focus:ring-wood-100"
                                />

                                <div className="rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_25px_80px_-70px_rgba(15,15,15,0.65)]">
                                    <div className="flex items-center gap-3 text-stone-500">
                                        <Stars size={18} className="text-wood-500" />
                                        <span className="text-xs uppercase tracking-[0.4em]">İpuçları</span>
                                    </div>
                                    <p className="mt-3 text-sm text-stone-500">
                                        Metni iki paragraftan fazla tutmamaya çalışın. İlk cümlede marka vaadinizi, ikinci cümlede teslimat veya servis sözünüzü belirtin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>

            </div>
        </div>
    );
}
