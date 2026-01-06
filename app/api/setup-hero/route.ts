import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    try {
        await connectDB();

        const slides = [
            {
                badge: 'Atelier Serisi',
                title: 'Minimalizmin\nEn Saf Hali',
                subtitle: 'Studio Serisi ile sadeliğin gücünü keşfedin. Her parça, modern yaşamın karmaşasına huzurlu bir yanıt olarak tasarlandı.',
                image: 'http://localhost:3000/images/hero-luxury-living.png',
                primaryCtaLabel: 'İncele',
                primaryCtaUrl: '/products',
                secondaryCtaLabel: 'İletişim',
                secondaryCtaUrl: '/contact',
            },
            {
                badge: 'Modern Collection',
                title: 'Zarafetin\nYeni Tanımı',
                subtitle: 'Modern yaşam alanları için özel tasarım raflar. Estetik ve fonksiyonelliği bir arada sunan özel koleksiyon.',
                image: 'http://localhost:3000/images/hero-modern-dining.png',
                primaryCtaLabel: 'Koleksiyonu Keşfet',
                primaryCtaUrl: '/products?collection=modern',
                secondaryCtaLabel: 'Detaylı Bilgi',
                secondaryCtaUrl: '/contact',
            },
            {
                badge: 'Cozy Corner',
                title: 'Okuma Köşeniz\nİçin Mükemmel',
                subtitle: 'Kitaplarınız için en şık ve doğal çözüm. Ahşabın sıcaklığını evinize taşıyın.',
                image: 'http://localhost:3000/images/hero-reading-corner.png',
                primaryCtaLabel: 'Şimdi Al',
                primaryCtaUrl: '/products?category=shelves',
                secondaryCtaLabel: 'İlham Al',
                secondaryCtaUrl: '/gallery',
            }
        ];

        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { $set: { homeHeroSlides: slides, updatedAt: new Date() } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, message: 'Hero slides updated', slides: settings.homeHeroSlides });
    } catch (error: any) {
        console.error('Error seeding hero slides:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
