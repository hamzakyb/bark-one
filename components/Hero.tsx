'use client';
// Redundancy check - triggering build

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeroSlide = {
  id: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
};

type HeroSettings = {
  slides?: HeroSlide[];
};

type HeroProps = {
  settings?: HeroSettings;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    badge: "Exclusive Collection",
    title: 'Yaşam Alanınıza\nZarafet Katın',
    subtitle: 'Heykelvari formlar ve doğal dokuların mükemmel uyumu. BarkOne ile evinizi küratör titizliğiyle tasarlayın.',
    image: '/hero-luxury.png',
    primaryCtaLabel: 'Koleksiyonu Keşfet',
    primaryCtaUrl: '/products',
    secondaryCtaLabel: 'Özel Tasarım',
    secondaryCtaUrl: '/contact',
  },
  {
    id: "slide-2",
    badge: 'Atelier Serisi',
    title: 'Minimalizmin\nEn Saf Hali',
    subtitle: 'Studio Serisi ile sadeliğin gücünü keşfedin. Her parça, modern yaşamın karmaşasına huzurlu bir yanıt olarak tasarlandı.',
    image: 'https://images.unsplash.com/photo-1616627562221-877ed9b674b1?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'İncele',
    primaryCtaUrl: '/products?collection=studio',
  },
  {
    id: "slide-3",
    badge: 'Limited Edition',
    title: 'Zamansız Tasarım\nKalıcı Estetik',
    subtitle: 'El işçiliği ile şekillenen özel masif ahşap raflarımızla, doğanın ruhunu duvarlarınıza taşıyın.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'Şimdi Keşfet',
    primaryCtaUrl: '/products?collection=atelier',
  }
];

export default function Hero({ settings }: HeroProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const slides = useMemo(() => settings?.slides && settings.slides.length > 0 ? settings.slides : DEFAULT_SLIDES, [settings]);

  return (
    <section className="relative w-full h-dvh min-h-[700px] overflow-hidden bg-black text-white">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full h-full">
        <CarouselContent className="w-full m-0 h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="w-full p-0 shrink-0 relative h-full">
              <div className="relative w-full h-full overflow-hidden">
                {/* Background Image - Precisely Filled */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === current ? 1 : 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-0 z-0"
                >
                  <Image
                    src={slide.image || ''}
                    alt={slide.title || 'Luxury Furniture'}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    quality={100}
                  />
                  {/* Cinematic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
                </motion.div>

                {/* Content Container */}
                <div className="container mx-auto px-6 h-full flex items-center relative z-20">
                  <div className="max-w-3xl -translate-y-8 md:-translate-y-12">
                    <AnimatePresence mode="wait">
                      {index === current && (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {/* Animated Badge */}
                          {slide.badge && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex items-center gap-3 mb-6"
                            >
                              <div className="w-8 h-[1px] bg-primary" />
                              <span className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase text-primary">
                                {slide.badge}
                              </span>
                            </motion.div>
                          )}

                          {/* Hero Title - Using Serif for Luxury */}
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8 tracking-tight whitespace-pre-line"
                          >
                            {slide.title}
                          </motion.h1>

                          {/* Refined Subtitle */}
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg md:text-xl text-white/70 font-light max-w-xl mb-12 leading-relaxed"
                          >
                            {slide.subtitle}
                          </motion.p>

                          {/* CTA Group */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-6"
                          >
                            <Link
                              href={slide.primaryCtaUrl || '/products'}
                              className="group inline-flex items-center gap-4 bg-white text-black px-10 py-5 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                              {slide.primaryCtaLabel}
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            {slide.secondaryCtaLabel && (
                              <Link
                                href={slide.secondaryCtaUrl || '/contact'}
                                className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-10 py-5 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-white/10 hover:border-white"
                              >
                                {slide.secondaryCtaLabel}
                              </Link>
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Minimalist Controls */}
        <div className="absolute bottom-12 right-12 z-30 flex items-center gap-8">
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs font-medium tracking-widest">0{current + 1}</span>
            <div className="w-24 h-[2px] bg-white/10 relative overflow-hidden">
              <motion.div
                key={current}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-0 bg-white"
              />
            </div>
            <span className="text-xs font-medium tracking-widest">0{slides.length}</span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button
              onClick={() => api?.scrollPrev()}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vertical Decorative Element */}
        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-8">
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 [writing-mode:vertical-rl] rotate-180">
            Premium Craftsmanship
          </span>
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
      </Carousel>

      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
}