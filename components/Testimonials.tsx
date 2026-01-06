'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

type TestimonialItem = {
    _id?: string;
    name?: string;
    role?: string;
    quote?: string;
    rating?: number;
};

type TestimonialsProps = {
    settings?: {
        badge?: string;
        heading?: string;
        description?: string;
        testimonials?: TestimonialItem[];
    };
};

const DEFAULT_BADGE = 'Müşteri Yorumları';
const DEFAULT_HEADING = 'Raf çözümlerimizi tercih edenlerin deneyimleri';
const DEFAULT_DESCRIPTION = 'BarkOne raflarıyla yaşam alanlarını düzenleyen kullanıcılarımızın geri bildirimleri.';

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
    {
        name: 'Ahmet Yılmaz',
        role: 'İç Mimari Tasarımcı',
        quote: 'BarkOne raflarının minimalist tasarımı ve kalitesi gerçekten etkileyici. Projelerimde sıkça yer veriyorum.',
        rating: 5,
    },
    {
        name: 'Zeynep Kaya',
        role: 'Ev Sahibi',
        quote: 'Oturma odam için Studio serisini aldım. Kurulumu çok basitti ve duvarda harika duruyor.',
        rating: 5,
    },
    {
        name: 'Murat Aras',
        role: 'Fotoğrafçı',
        quote: 'Ekipmanlarımı sergilemek için Atelier serisini tercih ettim. Hem sağlam hem de estetik.',
        rating: 5,
    },
];

export default function Testimonials({ settings }: TestimonialsProps) {
    const badge = settings?.badge || DEFAULT_BADGE;
    const heading = settings?.heading || DEFAULT_HEADING;
    const description = settings?.description || DEFAULT_DESCRIPTION;
    const testimonials = settings?.testimonials?.length ? settings.testimonials : DEFAULT_TESTIMONIALS;

    return (
        <section className="py-32 bg-stone-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wood-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-wood-500" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                                {badge}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
                            {heading}
                        </h2>
                        <p className="text-lg text-stone-500 font-light leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial._id ?? index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                            className="group"
                        >
                            <div className="h-full bg-white px-8 py-10 rounded-2xl border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-wood-900/5 hover:-translate-y-1 relative overflow-hidden">
                                {/* Subtle Wood Gradient Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-wood-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <Quote className="h-8 w-8 text-wood-300 mb-6 opacity-50" />

                                    <blockquote className="text-lg text-anthracite font-serif leading-relaxed mb-8 flex-grow">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </blockquote>

                                    <div className="pt-6 border-t border-stone-100">
                                        <div className="flex flex-col">
                                            <span className="text-base font-semibold text-anthracite tracking-wide">
                                                {testimonial.name}
                                            </span>
                                            <span className="text-xs font-medium uppercase tracking-widest text-wood-500 mt-1">
                                                {testimonial.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}