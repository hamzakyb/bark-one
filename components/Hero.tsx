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
import { ArrowRight } from 'lucide-react';

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
      'Modüler raf seçeneklerimizle oturma odasından mutfağa kadar her alanda düzen ve estetik sağlayın. Seçeneklerinizi kişiselleştirin, alanınızı verimli kullanın.',
    image: '/hero-luxury.png',
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
      'Minimalist çizgileriyle modern yaşam alanlarınıza şıklık katacak yeni koleksiyonumuzu keşfedin. Özel ölçü seçenekleriyle alanınıza uygun çözümler sunuyoruz.',
    image: 'https://images.unsplash.com/photo-1616627562221-877ed9b674b1?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'Koleksiyonu Gör',
    primaryCtaUrl: '/products?collection=studio',
  },
  {
    id: "slide-3",
    badge: 'Sınırlı Sürüm',
    title: 'Atelier Özel \nTasarımlar',
    subtitle:
      'El işçiliğiyle üretilmiş özel Atelier serimizle yaşam alanlarınıza benzersiz bir karakter kazandırın. Her parça tekil ve koleksiyonluktur.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=2400&auto=format&fit=crop',
    primaryCtaLabel: 'Keşfet',
    primaryCtaUrl: '/products?collection=atelier',
  }
];

function normalizeTitle(title: string) {
  if (!title.includes('\n')) return title;
  const [firstLine, secondLine] = title.split('\n');
  return (
    <>
      <span className="block">{firstLine}</span>
      <span className="block italic font-serif text-white/90">{secondLine}</span>
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
      className="relative w-full text-white flex items-center justify-center overflow-hidden"
      style={{ height: 'calc(100dvh - 3.5rem)' }} // 3.5rem = 56px (mobile header)
    >
      <div className="md:hidden" style={{ display: 'none' }}>
        {/* Hack to handle desktop specific height in CSS modules or Tailwind arbitrary values if needed, 
              but inline style is cleaner for dynamic calcs unless we use a custom class.
              We'll use a style tag or Tailwind arbitrary value for responsive height.
          */}
      </div>
      <style jsx global>{`
        @media (min-width: 768px) {
          section[class*="Hero"] {
            height: calc(100dvh - 4rem) !important; /* 4rem = 64px (desktop header) */
          }
        }
      `}</style>

      <Carousel opts={{ loop: true }} className="w-full h-full">
        <CarouselContent
          className="w-full m-0 h-full"
        >
          {slides.map((slide, index) => {
            const isDataImage = slide.image?.startsWith('data:') ?? false;

            return (
              <CarouselItem key={slide.id} className="w-full p-0 shrink-0 relative h-full">
                {/* Parallax Background */}
                <motion.div style={{ y }} className="absolute inset-0 z-0 select-none">
                  {/* Luxury Gradient Overlay - Clearer bottom for text contrast */}
                  <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/60 z-10" />
                  <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-transparent to-black/40 z-10 opacity-70" />

                  {isDataImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={slide.image}
                        alt={slide.title?.replace('\n', ' ') ?? 'Hero görseli'}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <Image
                      src={slide.image || ''}
                      alt={slide.title?.replace('\n', ' ') ?? 'Hero görseli'}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={100}
                      sizes="100vw"
                    />
                  )}
                </motion.div>

                {/* Content */}
                <motion.div
                  style={{ opacity }}
                  className="container mx-auto px-4 relative z-20 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* Badge */}
                    {slide.badge && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 overflow-hidden"
                      >
                        <span className="inline-block py-1.5 px-5 border border-white/30 rounded-full text-xs md:text-sm tracking-[0.2em] font-medium uppercase backdrop-blur-md bg-white/5">
                          {slide.badge}
                        </span>
                      </motion.div>
                    )}

                    {/* Main Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-3xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium mb-6 md:mb-8 tracking-tight leading-[1.1] md:leading-[1.1] text-balance drop-shadow-2xl"
                    >
                      {normalizeTitle(slide.title || '')}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg md:text-xl lg:text-2xl mb-12 text-white/90 font-light max-w-2xl mx-auto leading-relaxed text-balance drop-shadow-sm"
                    >
                      {slide.subtitle}
                    </motion.p>

                    {/* CTA Buttons - Vertical on mobile, row on desktop */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full sm:w-auto px-4 sm:px-0"
                    >
                      {/* Primary Button - Charismatic & Modern */}
                      {slide.primaryCtaLabel && (
                        <Link
                          href={slide.primaryCtaUrl || '/products'}
                          className="group relative px-12 py-5 bg-white text-black text-sm md:text-base font-medium tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {slide.primaryCtaLabel}
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </Link>
                      )}

                      {/* Secondary Button - Glass */}
                      {slide.secondaryCtaLabel && (
                        <Link
                          href={slide.secondaryCtaUrl || '/contact'}
                          className="group relative px-12 py-5 bg-transparent border border-white/40 text-white text-sm md:text-base font-medium tracking-widest uppercase overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white backdrop-blur-sm"
                        >
                          <span className="relative z-10">{slide.secondaryCtaLabel}</span>
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* Navigation - Minimalist */}
        <div className="hidden md:block">
          <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full border-none bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all w-14 h-14" />
          <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full border-none bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all w-14 h-14" />
        </div>
      </Carousel>

      {/* Scroll Indicator - Floating */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-linear-to-b from-transparent via-white/50 to-white" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}