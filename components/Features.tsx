'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
    Leaf,
    Hammer,
    ShieldCheck,
    Package,
    Truck,
    Palette,
    Wrench,
    Ruler,
    Sparkles,
    Layers,
    Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureItem = {
    _id?: string;
    title?: string;
    description?: string;
    icon?: string;
    highlight?: string;
};

type FeaturesProps = {
    settings?: {
        badge?: string;
        heading?: string;
        description?: string;
        features?: FeatureItem[];
    };
};

const normalizeIconKey = (value?: string) =>
    value?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';

const ICONS: Record<string, LucideIcon> = {
    leaf: Leaf,
    hammer: Hammer,
    shieldcheck: ShieldCheck,
    package: Package,
    truck: Truck,
    palette: Palette,
    wrench: Wrench,
    ruler: Ruler,
    sparkles: Sparkles,
    layers: Layers,
    box: Box,
};

export default function Features({ settings }: FeaturesProps) {
    const items = settings?.features?.length ? settings.features : undefined;

    const normalizedFeatures: FeatureItem[] = items?.length
        ? items
        : [
            {
                title: 'Dayanıklı Malzeme',
                description: 'Uzun ömürlü kullanım için seçilen masif ahşap ve birinci sınıf metallerle, nesiller boyu sürecek bir sağlamlık.',
                icon: 'ShieldCheck',
            },
            {
                title: 'Pratik Kurulum',
                description: 'Karmaşık montaj süreçlerine son. Akıllı bağlantı detayları ve kullanıcı dostu kılavuzlarla dakikalar içinde hazır.',
                icon: 'Hammer',
            },
            {
                title: 'Kişiselleştirilebilir',
                description: 'Mekanınızın ruhuna uyum sağlayan modüler tasarım. Farklı ölçü, doku ve renk seçenekleriyle tamamen size özel.',
                icon: 'Palette',
            },
        ];

    const badge = settings?.badge || 'BarkOne Prensibi';
    const heading = settings?.heading || 'Tasarım ve Fonksiyonun Kusursuz Dengesi';

    return (
        <section className="relative py-32 md:py-40 bg-stone-50 overflow-hidden">
            {/* Abstract Background Art */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-stone-100/50 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-stone-200/30 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-end">
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="block text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-stone-500 mb-6">
                                {badge}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-[1.1]">
                                {heading}
                            </h2>
                        </motion.div>
                    </div>
                    <div className="lg:col-span-7 lg:pl-12">
                        <motion.div
                            className="h-px bg-stone-300 w-full mb-8"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                        <motion.p
                            className="text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {settings?.description || 'Her detayında zanaatkarlığı hissettiren, modern yaşamın ihtiyaçlarına yanıt veren ve zamansız estetiğiyle mekanınızı dönüştüren raf sistemleri.'}
                        </motion.p>
                    </div>
                </div>

                {/* Editorial List Layout */}
                <div className="mt-20">
                    {normalizedFeatures.map((feature, index) => {
                        const iconKey = normalizeIconKey(feature.icon);
                        const IconComponent = iconKey ? ICONS[iconKey] : undefined;
                        const number = (index + 1).toString().padStart(2, '0');

                        return (
                            <motion.div
                                key={feature._id ?? index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative border-t border-stone-200 py-12 md:py-16 transition-colors duration-500 hover:bg-white"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    {/* Large Index Number */}
                                    <div className="md:col-span-2">
                                        <span className="block text-6xl md:text-7xl font-serif text-stone-200 group-hover:text-stone-900 transition-colors duration-500 opacity-50 group-hover:opacity-100">
                                            {number}
                                        </span>
                                    </div>

                                    {/* Icon & Content */}
                                    <div className="md:col-span-3">
                                        <div className="flex items-center gap-4 mb-2">
                                            {IconComponent && (
                                                <div className="p-3 rounded-full bg-stone-100 text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                                                    <IconComponent size={24} strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <h3 className="text-2xl font-serif text-stone-900">
                                                {feature.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="md:col-span-6 md:col-start-7">
                                        <p className="text-lg text-stone-500 font-light leading-relaxed group-hover:text-stone-700 transition-colors duration-500">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Interactive Arrow on Hover (Optional Decorative) */}
                                    <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {/* Final Border */}
                    <div className="border-t border-stone-200" />
                </div>
            </div>
        </section>
    );
}