'use client';

import { motion } from 'framer-motion';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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
    {
        name: 'Selin Demir',
        role: 'Grafik Tasarımcı',
        quote: 'Ofisim için aldığım raflar hem düzeni sağladı hem de decoratif bir hava kattı. Kesinlikle tavsiye ediyorum.',
        rating: 5,
    },
    {
        name: 'Can Vural',
        role: 'Mimar',
        quote: 'Ahşap kalitesi ve bitiş detayları piyasadaki pek çok üründen üstün.',
        rating: 5,
    },
];

export default function Testimonials({ settings }: TestimonialsProps) {
    const badge = settings?.badge || DEFAULT_BADGE;
    const heading = settings?.heading || DEFAULT_HEADING;
    const description = settings?.description || DEFAULT_DESCRIPTION;
    // Ensure we have enough items for a nice slider loop, duplicate defaults if needed for demo
    const testimonialsSource = settings?.testimonials?.length ? settings.testimonials : DEFAULT_TESTIMONIALS;
    // Duplicate more aggressively to ensure smooth loop for wide screens
    const testimonials = testimonialsSource.length < 5 ? [...testimonialsSource, ...testimonialsSource, ...testimonialsSource] : testimonialsSource;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start', // Changed to start for better multi-slide behavior
        slidesToScroll: 1,
    }, [
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-32 bg-stone-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wood-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header with Controls */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
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
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            className="rounded-full w-12 h-12 border-stone-200 text-stone-600 hover:bg-white hover:text-wood-600 hover:border-wood-200 transition-all duration-300"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            className="rounded-full w-12 h-12 border-stone-200 text-stone-600 hover:bg-white hover:text-wood-600 hover:border-wood-200 transition-all duration-300"
                        >
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>

                {/* Embla Slider */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-6 cursor-grab active:cursor-grabbing">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-6">
                                <div className="h-full bg-white px-8 py-10 rounded-2xl border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-wood-900/5 hover:-translate-y-2 relative overflow-hidden group">
                                    {/* Subtle Wood Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-wood-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6 opacity-50">
                                            <Quote className="h-8 w-8 text-wood-300" />
                                            {/* decorative dots */}
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 rounded-full bg-stone-300" />
                                                <div className="w-1 h-1 rounded-full bg-stone-300" />
                                                <div className="w-1 h-1 rounded-full bg-stone-300" />
                                            </div>
                                        </div>

                                        <blockquote className="text-lg text-anthracite font-serif leading-relaxed mb-8 flex-grow">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </blockquote>

                                        <div className="pt-6 border-t border-stone-100 mt-auto">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-serif text-lg text-stone-400">
                                                    {testimonial.name?.charAt(0)}
                                                </div>
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}