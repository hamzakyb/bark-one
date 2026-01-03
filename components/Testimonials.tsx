'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

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

const DEFAULT_BADGE = 'Müşteri Memnuniyeti';
const DEFAULT_HEADING = 'Kullanıcılarımızın BarkOne Deneyimleri';
const DEFAULT_DESCRIPTION = 'Binlerce mutlu müşterimizden bazıları görüşlerini paylaşıyor.';

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
        rating: 4,
    },
];

export default function Testimonials({ settings }: TestimonialsProps) {
    const badge = settings?.badge || DEFAULT_BADGE;
    const heading = settings?.heading || DEFAULT_HEADING;
    const description = settings?.description || DEFAULT_DESCRIPTION;
    const testimonials = settings?.testimonials?.length ? settings.testimonials : DEFAULT_TESTIMONIALS;

    return (
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full -ml-48 -mb-48 blur-3xl opacity-50"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <Badge variant="outline" className="mb-4 text-sm font-medium border-slate-200 text-slate-600">
                        {badge}
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        {heading}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed font-light">
                        {description}
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial._id ?? index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl bg-slate-50/50">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < (testimonial.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <blockquote className="text-lg text-slate-700 font-light italic mb-8 flex-grow">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </blockquote>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                                        <p className="text-sm text-slate-500 font-light">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}