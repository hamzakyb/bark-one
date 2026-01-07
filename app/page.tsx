import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductsSpotlight from '@/components/ProductsSpotlight';
import ProductCard from '@/components/ProductCard';
import InspirationGallery from '@/components/InspirationGallery';
import Testimonials from '@/components/Testimonials';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SiteSettings from '@/models/SiteSettings';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Star, Shield, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const revalidate = 0;

const MOCK_PRODUCTS = [
  {
    _id: 'demo-atelier-01',
    name: 'BarkOne 01 Raf Sistemi',
    price: 12990,
    images: ['https://images.unsplash.com/photo-1616628182504-9ff4b95d0c5c?q=80&w=1200&auto=format&fit=crop'],
    slug: 'atelier-01-raf-sistemi',
    description: 'Mat siyah metal detaylarla tamamlanan doğal ceviz raf sistemi.',
    stock: 10,
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-ligne-02',
    name: 'Ligne 02 Yüzer Raf',
    price: 8990,
    images: ['https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?q=80&w=1200&auto=format&fit=crop'],
    slug: 'ligne-02-yuzer-raf',
    description: 'İnce profil silüetiyle minimal yaşam alanları için tasarlandı.',
    stock: 15,
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-studio-03',
    name: 'Studio 03 Modüler Raf',
    price: 14990,
    images: ['https://images.unsplash.com/photo-1616627562221-877ed9b674b1?q=80&w=1200&auto=format&fit=crop'],
    slug: 'studio-03-moduler-raf',
    description: 'Modüler yapısıyla farklı kombinasyonlara uyum sağlayan raf sistemi.',
    stock: 5,
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-atelier-04',
    name: 'BarkOne 04 Konsol Raf',
    price: 11990,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'],
    slug: 'atelier-04-konsol-raf',
    description: 'Şampanya tonlu metal aksanlar ve naturel meşe yüzeylerin buluşması.',
    stock: 8,
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type FeatureItem = {
  _id?: string;
  title?: string;
  description?: string;
  icon?: string;
  highlight?: string;
};

type SpotlightItem = {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  href?: string;
};

type GalleryItem = {
  _id?: string;
  image?: string;
  label?: string;
  tag?: string;
  span?: string;
  aspectRatio?: string;
};

type TestimonialItem = {
  _id?: string;
  name?: string;
  role?: string;
  quote?: string;
  rating?: number;
};

type SiteSettingsData = {
  homeHeroBadge?: string;
  homeHeroTitle?: string;
  homeHeroSubtitle?: string;
  homeHeroImage?: string;
  homeHeroPrimaryCtaLabel?: string;
  homeHeroPrimaryCtaUrl?: string;
  homeHeroSecondaryCtaLabel?: string;
  homeHeroSecondaryCtaUrl?: string;
  homeHeroVerticalText?: string;
  homeHeroSlides?: Array<{
    _id?: string;
    badge?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
  }>;
  featuresBadge?: string;
  featuresHeading?: string;
  featuresDescription?: string;
  features?: FeatureItem[];
  spotlightBadge?: string;
  spotlightHeading?: string;
  spotlightDescription?: string;
  spotlightCtaLabel?: string;
  spotlightCtaUrl?: string;
  spotlightItems?: SpotlightItem[];
  galleryBadge?: string;
  galleryHeading?: string;
  galleryDescription?: string;
  galleryItems?: GalleryItem[];
  testimonialsBadge?: string;
  testimonialsHeading?: string;
  testimonialsDescription?: string;
  testimonials?: TestimonialItem[];
};

type FormattedProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  specifications: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
};

async function getProducts(): Promise<FormattedProduct[]> {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // Convert _id and dates to string to pass to client component
  const formattedProducts: FormattedProduct[] = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt ? p.createdAt.toString() : null,
    updatedAt: p.updatedAt ? p.updatedAt.toString() : null,
  }));

  if (!formattedProducts.length) {
    return MOCK_PRODUCTS;
  }

  return formattedProducts;
}

async function getSiteSettings(): Promise<SiteSettingsData> {
  await connectDB();

  let settings = await SiteSettings.findOne().lean<SiteSettingsData & { _id: string }>();

  if (!settings) {
    const created = await SiteSettings.create({});
    settings = created.toObject();
  }

  return JSON.parse(JSON.stringify(settings));
}

export default async function Home() {
  const [products, siteSettings] = await Promise.all([getProducts(), getSiteSettings()]);

  const heroSettings = {
    slides: siteSettings?.homeHeroSlides && siteSettings.homeHeroSlides.length > 0
      ? siteSettings.homeHeroSlides.map((slide: any, idx: number) => ({
        ...slide,
        id: slide._id?.toString() || `hero-slide-${idx}`
      }))
      : [
        {
          id: 'home-hero',
          badge: siteSettings?.homeHeroBadge,
          title: siteSettings?.homeHeroTitle,
          subtitle: siteSettings?.homeHeroSubtitle,
          image: siteSettings?.homeHeroImage,
          primaryCtaLabel: siteSettings?.homeHeroPrimaryCtaLabel,
          primaryCtaUrl: siteSettings?.homeHeroPrimaryCtaUrl,
          secondaryCtaLabel: siteSettings?.homeHeroSecondaryCtaLabel,
          secondaryCtaUrl: siteSettings?.homeHeroSecondaryCtaUrl,
        },
      ],
    verticalText: siteSettings?.homeHeroVerticalText,
  };

  const featureSettings = {
    badge: siteSettings?.featuresBadge,
    heading: siteSettings?.featuresHeading,
    description: siteSettings?.featuresDescription,
    features: siteSettings?.features,
  };

  const gallerySettings = {
    badge: siteSettings?.galleryBadge,
    heading: siteSettings?.galleryHeading,
    description: siteSettings?.galleryDescription,
    items: siteSettings?.galleryItems,
  };

  const testimonialSettings = {
    badge: siteSettings?.testimonialsBadge,
    heading: siteSettings?.testimonialsHeading,
    description: siteSettings?.testimonialsDescription,
    testimonials: siteSettings?.testimonials,
  };

  const spotlightSettings = {
    badge: siteSettings?.spotlightBadge,
    heading: siteSettings?.spotlightHeading,
    description: siteSettings?.spotlightDescription,
    ctaLabel: siteSettings?.spotlightCtaLabel,
    ctaUrl: siteSettings?.spotlightCtaUrl,
    items: siteSettings?.spotlightItems ?? [],
  };

  const spotlightItems = (spotlightSettings.items ?? []).filter(
    (item): item is SpotlightItem => Boolean(item && (item.title || item.description || item.image))
  );

  return (
    <main>
      <Hero settings={heroSettings} />

      <Features settings={featureSettings} />

      <ProductsSpotlight settings={spotlightSettings} products={products} />

      <InspirationGallery settings={gallerySettings} />

      <Testimonials settings={testimonialSettings} />
    </main>
  );
}
