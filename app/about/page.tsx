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
    ArrowRight,
    Lightbulb,
    Building,
    Handshake,
    Star
} from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AboutStat {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface AboutValue {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface AboutProcessItem {
    title: string;
    description: string;
}

interface AboutSettings {
    aboutHeroBadge: string;
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutHeroDescription: string;
    aboutHeroImage: string;
    aboutStats: Array<{
        icon: React.ComponentType<{ className?: string }>;
        value: string;
        label: string;
    }>;
    aboutValues: Array<{
        icon: React.ComponentType<{ className?: string }>;
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
    aboutHeroBadge: 'Hakkımızda',
    aboutHeroTitle: 'Doğal Estetik, Zamansız Tasarım',
    aboutHeroSubtitle: '1998 yılında başlayan yolculuğumuzda doğal malzemeleri modern tasarımla buluşturarak yaşam alanlarını dönüştürüyoruz.',
    aboutHeroDescription: 'BarkOne olarak, doğanın sunduğu eşsiz dokuları işçilik ve yenilikçi yaklaşımlarla birleştirerek her projede zamansız eserler yaratıyoruz.',
    aboutHeroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
    aboutStats: [
        {
            icon: Users,
            title: '5000+',
            description: 'Mutlu Müşteri'
        },
        {
            icon: Award,
            title: '25+',
            description: 'Yıllık Deneyim'
        },
        {
            icon: Building,
            title: '1000+',
            description: 'Tamamlanmış Proje'
        },
        {
            icon: Star,
            title: '4.9/5',
            description: 'Müşteri Puanı'
        }
    ],
    aboutValues: [
        {
            icon: Heart,
            title: 'Kalite Odaklı',
            description: 'Her projede en yüksek kalite standartlarını koruyarak uzun ömürlü ve estetik çözümler sunuyoruz.'
        },
        {
            icon: Shield,
            title: 'Güvenilirlik',
            description: 'Söz verdiğimiz tarihte teslimat ve müşteri memnuniyetini her zaman ön planda tutuyoruz.'
        },
        {
            icon: Lightbulb,
            title: 'Yenilikçi',
            description: 'Sektördeki trendleri takip ederek modern ve fonksiyonel tasarımlar geliştiriyoruz.'
        },
        {
            icon: Handshake,
            title: 'Müşteri Odaklı',
            description: 'Her müşterinin ihtiyaçlarını anlayarak kişiselleştirilmiş çözümler üretiyoruz.'
        }
    ],
    aboutProcess: [
        {
            title: 'Keşif ve Planlama',
            description: 'Mekanınızı detaylıca inceliyor, ihtiyaçlarınızı analiz ediyor ve en uygun çözümü planlıyoruz.'
        },
        {
            title: 'Tasarım ve Onay',
            description: 'Modern tasarım prensipleriyle 3D görsellemeler hazırlayıp onayınız için sunuyoruz.'
        },
        {
            title: 'Üretim ve Montaj',
            description: 'Ustalarımız tarafından hassasiyetle üretilen ürünleri profesyonel ekiplerle montajını yapıyoruz.'
        },
        {
            title: 'Teslimat ve Destek',
            description: 'Projenin teslimatını yapıyor ve uzun vadeli destek hizmetimizle yanınızda oluyoruz.'
        }
    ],
    aboutCtaTitle: 'Projenizi Bizimle Hayata Geçirin',
    aboutCtaSubtitle: 'Uzman ekibimizle tanışmak ve projeniz için özel çözümlerimiz hakkında bilgi almak için bizimle iletişime geçin.',
    aboutCtaPrimaryLabel: 'Ücretsiz Danışmanlık',
    aboutCtaPrimaryHref: '/contact',
    aboutCtaSecondaryLabel: 'Referansları İncele',
    aboutCtaSecondaryHref: '/#testimonials',
    aboutTeamTitle: '',
    aboutTeamDescription: ''
};

export default function AboutPage() {
    const { settings } = useSiteSettings();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [pageSettings, setPageSettings] = useState<AboutSettings>({
        ...DEFAULT_SETTINGS,
        ...settings,
        aboutTeamTitle: settings?.aboutTeamTitle || DEFAULT_SETTINGS.aboutTeamTitle,
        aboutTeamDescription: settings?.aboutTeamDescription || DEFAULT_SETTINGS.aboutTeamDescription
    });

    useEffect(() => {
        setIsMounted(true);
        
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (!response.ok) throw new Error('Failed to load settings');
                const data = await response.json();
                setPageSettings(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error('Error fetching about settings:', error);
            }
        };

        loadSettings();
    }, []);

    if (!isMounted) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/10 to-transparent" />
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <Badge className="w-fit px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 border-slate-200">
                                {pageSettings.aboutHeroBadge}
                            </Badge>
                            
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-6xl font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                    {pageSettings.aboutHeroTitle}
                                </h1>
                                <p className="text-lg lg:text-xl text-slate-600 font-light">
                                    {pageSettings.aboutHeroSubtitle}
                                </p>
                            </div>
                            
                            <p className="text-slate-600 leading-relaxed max-w-2xl">
                                {pageSettings.aboutHeroDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white" asChild>
                                    <Link href={pageSettings.aboutCtaPrimaryHref}>
                                        {pageSettings.aboutCtaPrimaryLabel}
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href={pageSettings.aboutCtaSecondaryHref}>
                                        {pageSettings.aboutCtaSecondaryLabel}
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={pageSettings.aboutHeroImage}
                                    alt="Hakkımızda"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Rakamlarla BarkOne
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Yılların birikimi ve binlerce mutlu müşteriyle şekillendirdiğimiz başarı hikayemiz.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pageSettings.aboutStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                            <stat.icon className="h-8 w-8 text-slate-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-slate-900 mb-2">
                                            {stat.title}
                                        </div>
                                        <div className="text-slate-600">
                                            {stat.description}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Değerlerimiz
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Her projemizde rehberimiz olan temel değerlerimiz ve iş yapış biçimimiz.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pageSettings.aboutValues.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <value.icon className="h-6 w-6 text-slate-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {value.title}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Çalışma Sürecimiz
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Projenizi hayata geçirmek için izlediğimiz adımlar ve metodolojimiz.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {pageSettings.aboutProcess.map((process, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="flex gap-6"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    {index < pageSettings.aboutProcess.length - 1 && (
                                        <div className="w-0.5 h-16 bg-slate-300 mt-4" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Card className="border-slate-200 bg-white shadow-sm">
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                                {process.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {process.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="border-slate-200 bg-linear-to-br from-slate-50 to-white shadow-xl">
                            <CardContent className="p-12 text-center">
                                <div className="max-w-3xl mx-auto space-y-6">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                                        {pageSettings.aboutCtaTitle}
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        {pageSettings.aboutCtaSubtitle}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white" asChild>
                                            <Link href={pageSettings.aboutCtaPrimaryHref}>
                                                {pageSettings.aboutCtaPrimaryLabel}
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" asChild>
                                            <Link href={pageSettings.aboutCtaSecondaryHref}>
                                                {pageSettings.aboutCtaSecondaryLabel}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
