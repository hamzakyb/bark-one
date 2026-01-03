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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
                  description: 'Uzun ömürlü kullanım için seçilen malzemelerle raf ömrünü uzatın.',
                  icon: 'ShieldCheck',
              },
              {
                  title: 'Pratik Kurulum',
                  description: 'Araç gereçleri azaltan paketleme ile hızlı kurulum sağlayın.',
                  icon: 'Hammer',
              },
              {
                  title: 'Kişiselleştirilebilir',
                  description: 'Farklı ölçüler ve renk kombinasyonlarıyla alanınıza uyarlayın.',
                  icon: 'Palette',
              },
          ];

    const badge = settings?.badge || 'BarkOne Raf Sistemleri';
    const heading =
        settings?.heading || (
            <>
                Güven veren <span className="font-serif italic">raflar</span> için üç temel sözümüz
            </>
        );
    const description =
        settings?.description ||
        'Dayanıklı malzeme, özenli üretim ve uzun ömürlü kullanım. Yaşam alanınıza uygun raf çözümünü kolayca seçmeniz için her detayı netleştiriyoruz.';

    return (
        <section className="relative overflow-hidden py-28 md:py-36 bg-gradient-to-b from-stone-50 via-white to-stone-50">
            {/* Luxury Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-stone-200 rounded-full filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-300 rounded-full filter blur-3xl opacity-10"></div>
            </div>

            <div className="container relative z-10 mx-auto px-6 sm:px-8">
                {/* Premium Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto mb-24 text-center max-w-4xl"
                >
                    {/* Modern Lux Brand Identity */}
                    <div className="mb-16 relative flex flex-col items-center">
                        <h3 className="text-2xl md:text-3xl font-serif font-light text-stone-800 tracking-[0.5em] uppercase mb-4">
                            {badge}
                        </h3>
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                    </div>
                    
                    {/* Statement Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-900 mb-8 leading-tight tracking-tight">
                        {heading}
                    </h2>
                    
                    {/* Refined Description */}
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
                        {description}
                    </p>
                </motion.div>

                {/* Unique Luxury Card Design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {normalizedFeatures.map((feature, index) => {
                        const iconKey = normalizeIconKey(feature.icon);
                        const IconComponent = iconKey ? ICONS[iconKey] : undefined;
                        
                        return (
                            <motion.div
                                key={feature._id ?? `${feature.title ?? 'feature'}-${index}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: index * 0.2 }}
                                className="group"
                            >
                                <Card className="h-full border-0 bg-gradient-to-br from-white via-white to-stone-50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] transition-all duration-700 relative">
                                    {/* Decorative Accent Elements */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-400 to-stone-300"></div>
                                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-stone-200 opacity-20"></div>
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-stone-100 opacity-20"></div>
                                    
                                    <CardHeader className="pb-6 text-center relative z-10">
                                        {/* Premium Icon Display */}
                                        <div className="mx-auto mb-8 relative">
                                            <div className="absolute inset-0 bg-stone-200 rounded-2xl transform rotate-6 opacity-10"></div>
                                            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-stone-50 to-white border border-stone-100 shadow-lg">
                                                <div className="absolute inset-0 bg-gradient-to-br from-stone-300/5 to-transparent rounded-2xl"></div>
                                                {IconComponent ? (
                                                    <IconComponent className="h-12 w-12 text-stone-600" strokeWidth={1.25} />
                                                ) : (
                                                    <span className="text-3xl font-serif text-stone-600">★</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Elegant Title */}
                                        <CardTitle className="text-2xl font-light text-stone-800 mb-4 tracking-wide relative">
                                            <span className="relative z-10">{feature.title}</span>
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-stone-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="text-center pt-0 px-8 pb-12 relative z-10">
                                        {/* Sophisticated Description */}
                                        <p className="text-stone-600 leading-relaxed tracking-wide font-light text-lg">
                                            {feature.description}
                                        </p>
                                        
                                        {/* Subtle CTA Element */}
                                        <div className="mt-8 flex justify-center">
                                            <div className="w-8 h-8 rounded-full border-2 border-stone-200 flex items-center justify-center group-hover:border-stone-400 transition-colors duration-300">
                                                <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-stone-400 transition-colors duration-300"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}