import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductCard from '@/components/ProductCard';
import InspirationGallery from '@/components/InspirationGallery';
import Testimonials from '@/components/Testimonials';
import dbConnect from '@/lib/db';
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
  await dbConnect();
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
  await dbConnect();

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
    slides: [
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

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm font-medium">
              {spotlightSettings.badge || 'Öne Çıkan Ürünler'}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {spotlightSettings.heading || (
                <>
                  Modern <span className="text-primary">Duvar Rafları</span>
                </>
              )}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              {spotlightSettings.description ||
                'Minimalist tasarımlarımızla yaşam alanlarınızda düzen ve estetik bir araya geliyor. Kaliteli malzemeler, pratik kurulum ve şık görünüm.'}
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href={spotlightSettings.ctaUrl || '/products'}>
                {spotlightSettings.ctaLabel || 'Tüm Ürünleri Gör'}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6 border-0 shadow-sm">
              <CardContent className="p-0">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">2 Yıl Garanti</h3>
                <p className="text-sm text-gray-600">Tüm ürünlerimizde</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm">
              <CardContent className="p-0">
                <Truck className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Ücretsiz Kargo</h3>
                <p className="text-sm text-gray-600">1500 TL ve üzeri</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm">
              <CardContent className="p-0">
                <Package className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Hızlı Teslimat</h3>
                <p className="text-sm text-gray-600">3-5 iş günü</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm">
              <CardContent className="p-0">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Müşteri Memnuniyeti</h3>
                <p className="text-sm text-gray-600">4.8/5 puan</p>
              </CardContent>
            </Card>
          </div>

          {/* Spotlight Items */}
          {spotlightItems.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Öne Çıkanlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {spotlightItems.map((item) => (
                  <Card key={item._id ?? item.title} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <Link href={item.href && item.href.startsWith('/') ? item.href : item.href || '#'}>
                      <div className="relative aspect-video overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title || 'Öne çıkan ürün'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(min-width: 1024px) 400px, (min-width: 768px) 360px, 100vw"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {item.price && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white/90 backdrop-blur text-gray-900">
                              {item.price}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 line-clamp-2">{item.description}</p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <Card className="text-center p-12 border-2 border-dashed border-gray-300">
              <CardContent className="p-0">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Yakında</h3>
                <p className="text-gray-600">
                  Raf ürünlerimize yeni tasarımlar ekliyoruz. İlk haberdar olmak için bültenimize katılın.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: FormattedProduct) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <InspirationGallery settings={gallerySettings} />

      <Testimonials settings={testimonialSettings} />
    </main>
  );
}
