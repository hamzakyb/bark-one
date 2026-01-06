'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Users,
    Award,
    Heart,
    Shield,
    ArrowUpRight,
    Lightbulb,
    Building,
    Handshake,
    Star
} from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Button } from '@/components/ui/button';

interface AboutSettings {
    aboutHeroBadge: string;
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutHeroDescription: string;
    aboutHeroImage: string;
    aboutStats: Array<{
        icon: any;
        title: string;
        description: string;
    }>;
    aboutValues: Array<{
        icon: any;
        title: string;
        description: string;
    }>;
    aboutProcess: Array<{
        title: string;
        description: string;
    }>;
    aboutTeamTitle: string;
    aboutTeamDescription: string;
    aboutCtaTitle: string;
    aboutCtaSubtitle: string;
    aboutCtaPrimaryLabel: string;
    aboutCtaPrimaryHref: string;
    aboutCtaSecondaryLabel: string;
    aboutCtaSecondaryHref: string;
}

const DEFAULT_SETTINGS = {
    aboutHeroBadge: 'Hikayemiz',
    aboutHeroTitle: 'Zamanın ötesinde estetik.',
    aboutHeroSubtitle: 'Doğal malzemeyi modern zanaatkarlıkla buluşturuyor, yaşam alanlarına ruh katıyoruz.',
    aboutHeroDescription: 'BarkOne olarak, doğanın sunduğu eşsiz dokuları işçilik ve yenilikçi yaklaşımlarla birleştirerek her projede zamansız eserler yaratıyoruz. Her parça, bir tasarım objesi olmanın ötesinde, yaşanmışlığın ve kalitenin bir simgesidir.',
    aboutHeroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
    aboutStats: [
        { icon: Users, title: '5K+', description: 'Mutlu Müşteri' },
        { icon: Award, title: '25', description: 'Yıllık Deneyim' },
        { icon: Building, title: '1K+', description: 'Tamamlanmış Proje' },
        { icon: Star, title: '4.9', description: 'Müşteri Puanı' }
    ],
    aboutValues: [
        { icon: Heart, title: 'Tutku', description: 'Ahşabın doğallığına olan tutkumuz, her detayda kendini gösterir.' },
        { icon: Shield, title: 'Güven', description: 'Söz verdiğimiz kaliteden ve zamandan asla ödün vermeyiz.' },
        { icon: Lightbulb, title: 'İnovasyon', description: 'Geleneksel dokuları modern teknolojilerle harmanlarız.' },
        { icon: Handshake, title: 'Bağlılık', description: 'Müşterilerimizle kurduğumuz bağ, ürünlerimiz kadar sağlamdır.' }
    ],
    aboutProcess: [
        { title: 'Keşif', description: 'Mekanınızı ve hayallerinizi dinliyor, analiz ediyoruz.' },
        { title: 'Tasarım', description: 'Estetik ve fonksiyonelliği birleştiren taslaklar hazırlıyoruz.' },
        { title: 'Üretim', description: 'Usta ellerde, en kaliteli malzemelerle hayat buluyor.' },
        { title: 'Teslimat', description: 'Evinizin en değerli köşesine özenle yerleştiriyoruz.' }
    ],
    aboutCtaTitle: 'Yeni bir soluk getirin.',
    aboutCtaSubtitle: 'Evinizin hikayesini birlikte yeniden yazalım.',
    aboutCtaPrimaryLabel: 'İletişime Geçin',
    aboutCtaPrimaryHref: '/contact',
    aboutCtaSecondaryLabel: 'Koleksiyonu Keşfet',
    aboutCtaSecondaryHref: '/products',
    aboutTeamTitle: '',
    aboutTeamDescription: ''
};

export default function AboutPage() {
    const { settings } = useSiteSettings();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [pageSettings, setPageSettings] = useState<AboutSettings>({
        ...DEFAULT_SETTINGS,
        ...(settings as any),
        // Ensure default fallbacks if settings keys exist but are empty strings? 
        // Or trust the spread. Usually spread is fine for overrides.
    });

    useEffect(() => {
        setIsMounted(true);
        // Also fetch from API to be sure we have latest server-side settings
        // similar to original component
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (!response.ok) return;
                const data = await response.json();
                setPageSettings(prev => ({ ...prev, ...data }));
            } catch (error) {
                // silent fail
            }
        };
        void loadSettings();
    }, []);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="container px-6 mx-auto">
                    <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block py-2 px-4 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-stone-500 mb-8"
                        >
                            {pageSettings.aboutHeroBadge}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-serif text-stone-900 mb-8 tracking-tight leading-[0.9]"
                        >
                            {pageSettings.aboutHeroTitle}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-2xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed"
                        >
                            {pageSettings.aboutHeroSubtitle}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-sm"
                    >
                        <Image
                            src={pageSettings.aboutHeroImage}
                            alt="About Hero"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mt-20 text-center"
                    >
                        <p className="text-xl md:text-2xl text-stone-800 font-serif leading-relaxed">
                            "{pageSettings.aboutHeroDescription}"
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - Minimalist */}
            <section className="py-20 border-y border-stone-200 bg-white">
                <div className="container px-6 mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {pageSettings.aboutStats.map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="text-4xl md:text-5xl font-serif text-stone-900">
                                    {stat.title}
                                </div>
                                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
                                    {stat.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values - Editorial Grid */}
            <section className="py-32">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 md:items-start">
                        <div className="md:w-1/3 sticky top-32">
                            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Değerlerimiz</h2>
                            <p className="text-stone-600 leading-relaxed font-light text-lg">
                                Bizi biz yapan, tasarımlarımıza yön veren temel inançlarımız.
                            </p>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                            {pageSettings.aboutValues.map((value, idx) => (
                                <div key={idx} className="group">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-100 text-stone-900 mb-6 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                                        <value.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-serif text-stone-900 mb-3">{value.title}</h3>
                                    <p className="text-stone-500 leading-relaxed font-light">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Process - Horizontal Timeline Styled */}
            <section className="py-24 bg-stone-100/50">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 block mb-3">
                            Süreç
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Nasıl Çalışıyoruz?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-stone-300 -z-10" />

                        {pageSettings.aboutProcess.map((step, idx) => (
                            <div key={idx} className="relative pt-0 md:pt-8 group">
                                <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-50 border border-stone-300 items-center justify-center z-10 text-xs font-bold text-stone-400 group-hover:border-stone-900 group-hover:text-stone-900 transition-colors duration-300">
                                    {idx + 1}
                                </div>
                                <div className="bg-white p-8 md:p-6 rounded-sm shadow-sm md:shadow-none md:bg-transparent text-center md:text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <h3 className="text-xl font-serif text-stone-900 mb-3">{step.title}</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                <div className="container px-6 mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif mb-8 max-w-3xl mx-auto leading-tight">
                        {pageSettings.aboutCtaTitle}
                    </h2>
                    <p className="text-lg md:text-xl text-stone-400 font-light mb-12 max-w-xl mx-auto">
                        {pageSettings.aboutCtaSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button
                            asChild
                            variant="default"
                            className="bg-white text-stone-900 hover:bg-stone-200 h-14 px-8 rounded-full uppercase tracking-widest text-xs font-bold"
                        >
                            <Link href={pageSettings.aboutCtaPrimaryHref}>
                                {pageSettings.aboutCtaPrimaryLabel}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-stone-700 text-white hover:bg-stone-800 hover:text-white h-14 px-8 rounded-full uppercase tracking-widest text-xs font-bold"
                        >
                            <Link href={pageSettings.aboutCtaSecondaryHref}>
                                {pageSettings.aboutCtaSecondaryLabel}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
