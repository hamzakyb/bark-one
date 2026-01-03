'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
    title: 'Eviniz için \nduvar rafları',
    subtitle:
      'Modüler raf seçeneklerimizle oturma odasından mutfağa kadar her alanda düzen ve estetik sağlayın.\nSeçeneklerinizi kişiselleştirin, alanınızı verimli kullanın.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'Rafları İncele',
    primaryCtaUrl: '/products',
    secondaryCtaLabel: 'Destek Al',
    secondaryCtaUrl: '/contact',
  },
  {
    id: "slide-2",
    badge: 'Yeni Koleksiyon',
    title: 'Studio Serisi \nYeni Geldi',
    subtitle:
      'Minimalist çizgileriyle modern yaşam alanlarınıza şıklık katacak yeni koleksiyonumuzu keşfedin.\nÖzel ölçü seçenekleriyle alanınıza uygun çözümler sunuyoruz.',
    image: 'https://images.unsplash.com/photo-1616627562221-877ed9b674b1?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'Koleksiyonu Gör',
    primaryCtaUrl: '/products?collection=studio',
    secondaryCtaLabel: 'Özelleştir',
    secondaryCtaUrl: '/contact',
  },
  {
    id: "slide-3",
    badge: 'Sınırlı Sürüm',
    title: 'Atelier Özel \nTasarımlar',
    subtitle:
      'El işçiliğiyle üretilmiş özel Atelier serimizle yaşam alanlarınıza benzersiz bir karakter kazandırın.\nHer parça tekil ve koleksiyonluktur.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'Keşfet',
    primaryCtaUrl: '/products?collection=atelier',
    secondaryCtaLabel: 'Detaylar',
    secondaryCtaUrl: '/about',
  }
];

function normalizeTitle(title: string) {
  if (!title.includes('\n')) return title;
  const [firstLine, secondLine] = title.split('\n');
  return (
    <>
      <span className="block font-extralight">{firstLine}</span>
      <span className="block font-serif italic text-wood-400">{secondLine}</span>
    </>
  );
}

export default function Hero({ settings }: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const slides = useMemo(() => settings?.slides && settings.slides.length > 0 ? settings.slides : DEFAULT_SLIDES, [settings]);
  
  return (
    <section 
      ref={ref}
      className="relative min-h-screen w-full text-white flex items-center justify-center overflow-hidden"
      style={{ height: '100dvh' }}
    >
      <Carousel className="w-full" style={{ height: '100dvh' }}>
        <CarouselContent 
          className="w-full m-0" 
          style={{ height: '100dvh', display: 'flex', alignItems: 'stretch' }}
        >
          {slides.map((slide, index) => {
            const isDataImage = slide.image?.startsWith('data:') ?? false;
            
            return (
              <CarouselItem key={slide.id} className="w-full p-0 shrink-0" style={{ height: '100dvh' }}>
                {/* Parallax Background */}
                <motion.div style={{ y }} className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black/80 z-10" />
                  {isDataImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={slide.image}
                        alt={slide.title?.replace('\n', ' ') ?? 'Hero görseli'}
                        className="absolute inset-0 h-full w-full object-cover scale-110"
                      />
                    </div>
                  ) : (
                    <Image
                      src={slide.image || ''}
                      alt={slide.title?.replace('\n', ' ') ?? 'Hero görseli'}
                      fill
                      className="object-cover scale-110"
                      priority={index === 0}
                      quality={100}
                    />
                  )}
                </motion.div>

                {/* Elegant Grain Texture Overlay */}
                <div className="absolute inset-0 z-10 opacity-10 mix-blend-overlay">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhaW4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWluKSIvPjwvc3ZnPg==')]" />
                </div>

                {/* Content */}
                <motion.div
                  style={{ opacity }}
                  className="container mx-auto px-4 relative z-20 text-center h-full flex items-center justify-center"
                >
                  <div className="w-full">
                    {/* Main Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-6 tracking-tight leading-none whitespace-pre-line"
                    >
                      {normalizeTitle(slide.title || '')}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="text-base md:text-lg lg:text-xl mb-8 md:mb-12 text-white/80 font-light max-w-3xl mx-auto leading-relaxed tracking-wide px-4"
                    >
                      {slide.subtitle}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
                    >
                      <Link
                        href={slide.primaryCtaUrl || '/products'}
                        className="group relative px-10 py-4 bg-white text-black font-medium tracking-wide overflow-hidden transition-all duration-500 hover:scale-105"
                      >
                        <span className="relative z-10">{slide.primaryCtaLabel}</span>
                        <div className="absolute inset-0 bg-wood-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                          {slide.primaryCtaLabel}
                        </span>
                      </Link>

                      <Link
                        href={slide.secondaryCtaUrl || '/contact'}
                        className="px-10 py-4 border-2 border-white/40 text-white font-light tracking-wide hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
                      >
                        {slide.secondaryCtaLabel}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 size-12 rounded-full border border-white/30 bg-black/20 text-white hover:bg-white/10 hover:border-white/50" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 size-12 rounded-full border border-white/30 bg-black/20 text-white hover:bg-white/10 hover:border-white/50" />
      </Carousel>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.25em] uppercase text-white/60">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-12 w-px bg-linear-to-b from-white/70 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}