import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    // Brand Assets
    siteLogoLight: {
        type: String,
        default: '',
    },
    siteLogoDark: {
        type: String,
        default: '',
    },
    adminLogo: {
        type: String,
        default: '',
    },

    // Homepage Hero
    homeHeroBadge: {
        type: String,
        default: 'Raf Çözümleri',
    },
    homeHeroTitle: {
        type: String,
        default: 'Modern Duvar Rafları',
    },
    homeHeroSubtitle: {
        type: String,
        default: 'Minimalist tasarımlarla yaşam alanlarınıza şıklık katın',
    },
    homeHeroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2400&auto=format&fit=crop',
    },
    homeHeroPrimaryCtaLabel: {
        type: String,
        default: 'Rafları İncele',
    },
    homeHeroPrimaryCtaUrl: {
        type: String,
        default: '/products',
    },
    homeHeroSecondaryCtaLabel: {
        type: String,
        default: 'Destek Al',
    },
    homeHeroSecondaryCtaUrl: {
        type: String,
        default: '/contact',
    },

    // Homepage Features
    featuresBadge: {
        type: String,
        default: 'BarkOne Raf Sistemleri',
    },
    featuresHeading: {
        type: String,
        default: 'Güven veren raflar için üç temel sözümüz',
    },
    featuresDescription: {
        type: String,
        default: 'Dayanıklı malzeme, özenli üretim ve uzun ömürlü kullanım. Yaşam alanınıza uygun raf çözümünü kolayca seçmeniz için her detayı netleştiriyoruz.',
    },
    features: [{
        title: String,
        description: String,
        icon: String,
        highlight: String,
    }],

    // Product Highlights / Spotlight
    spotlightBadge: {
        type: String,
        default: 'Raf Ürünlerimiz',
    },
    spotlightHeading: {
        type: String,
        default: 'Öne çıkan duvar rafları',
    },
    spotlightDescription: {
        type: String,
        default: 'Oturma odasından çalışma alanına kadar düzen ve depolama sağlayan raf çözümlerimizi keşfedin.',
    },
    spotlightCtaLabel: {
        type: String,
        default: 'Tüm Ürünleri Gör',
    },
    spotlightCtaUrl: {
        type: String,
        default: '/products',
    },
    spotlightItems: [{
        title: String,
        description: String,
        price: String,
        image: String,
        href: String,
    }],

    // Inspiration Gallery
    galleryBadge: {
        type: String,
        default: 'Galeri',
    },
    galleryHeading: {
        type: String,
        default: 'Yaşam alanınıza ilham veren sahneler',
    },
    galleryDescription: {
        type: String,
        default: 'Ürünlerimizi mekânınızın farklı zonlarına taşıyarak dengeyi keşfedin.',
    },
    galleryItems: [{
        image: String,
        label: String,
        tag: String,
        span: String,
        aspectRatio: String,
    }],

    // About Page
    aboutHeroBadge: {
        type: String,
        default: 'Hakkımızda',
    },
    aboutHeroTitle: {
        type: String,
        default: 'BarkOne ile yaşam alanlarınıza düzen, sıcaklık ve karakter katıyoruz',
    },
    aboutHeroSubtitle: {
        type: String,
        default:
            'İstanbul’daki atölyemizde ürettiğimiz modüler duvar rafları; fonksiyonel tasarımı, sürdürülebilir malzemeleri ve butik üretim anlayışıyla öne çıkıyor.',
    },
    aboutHeroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1616627567555-7a48bd348b7e?q=80&w=2600&auto=format&fit=crop',
    },
    aboutIntroTitle: {
        type: String,
        default: 'Biz Kimiz?',
    },
    aboutIntroBody: {
        type: String,
        default:
            'BarkOne, modüler raf sistemlerini merkezi konut ve ticari projeler için özelleştiren bağımsız bir tasarım kolektifidir. 2016’dan bu yana iç mimarlar, mimarlık ofisleri ve ev sahipleriyle birlikte çalışarak, her yaşam alanının özgün bir hikâyesi olduğuna inanıyoruz.',
    },
    aboutIntroSecondaryBody: {
        type: String,
        default:
            'Üretim süreçlerimizde yerel tedarik zincirleriyle çalışıyor, her rafı sipariş üzerine hazırlıyoruz. Böylece stok fazlasını ortadan kaldırırken, malzeme verimliliğini en üst seviyeye çıkarıyoruz.',
    },
    aboutWorkshopTitle: {
        type: String,
        default: 'Atölyemiz',
    },
    aboutWorkshopBody: {
        type: String,
        default:
            'Masif meşe, ceviz ve fırınlanmış çam gibi doğal malzemeleri, toz boyalı çelik aksesuarlarla birleştiriyoruz. Her modül, CNC kesim ve el işçiliği sayesinde kusursuz birleşimlere sahip.',
    },
    aboutStats: {
        type: [
            {
                icon: String,
                title: String,
                description: String,
            },
        ],
        default: [
            { icon: 'Ruler', title: '180+ Proje', description: 'Özel ölçü raf çözümlerini iç mimarlar ve konut sahipleri için hayata geçirdik.' },
            { icon: 'Users', title: '12 Kişilik Ekip', description: 'Tasarımdan montaja kadar süreci yöneten multidisipliner ekip.' },
            { icon: 'ShieldCheck', title: '2 Yıl Garanti', description: 'Tüm ürünlerimizde malzeme ve işçilik garantisi sunuyoruz.' },
        ],
    },
    aboutValues: {
        type: [
            {
                icon: String,
                title: String,
                description: String,
            },
        ],
        default: [
            { icon: 'Leaf', title: 'Sürdürülebilir Malzeme', description: 'Sertifikalı ormanlardan elde edilen masif ahşap ve geri dönüştürülebilir metal bileşenler kullanıyoruz.' },
            { icon: 'Sparkles', title: 'Zanaat & Teknoloji', description: 'El işçiliğini CNC üretimle buluşturup kusursuz yüzey kalitesi ve dayanıklılık sağlıyoruz.' },
            { icon: 'Users', title: 'İş Birlikçi Tasarım', description: 'Kullanıcı alışkanlıklarını dinleyip yaşam alanına özel modüler raf senaryoları geliştiriyoruz.' },
        ],
    },
    aboutProcessTitle: {
        type: String,
        default: 'Nasıl Çalışıyoruz?',
    },
    aboutProcessItems: {
        type: [
            {
                title: String,
                description: String,
            },
        ],
        default: [
            { title: '1. Keşif & Analiz', description: 'Alan ölçüleri, depolama ihtiyaçları ve stil tercihlerini birlikte değerlendiriyoruz.' },
            { title: '2. Konsept & Render', description: '3B görsellerle raf kombinasyonlarını sunuyor, modüler seçenekleri birlikte netleştiriyoruz.' },
            { title: '3. Üretim & Kurulum', description: 'Atölyemizde üretilen parçalar, uzman montaj ekibimiz tarafından kuruluyor.' },
        ],
    },
    aboutTeamBody: {
        type: String,
        default:
            'Endüstriyel tasarımcılar, marangozlar ve proje yöneticilerinden oluşan ekibimiz, yerel üretimin sürdürülebilirliğine inanıyor.',
    },
    aboutTeamTags: {
        type: [String],
        default: ['İç Mimar', 'Marangoz', 'Metal İşleri', 'Proje Koordinasyon'],
    },
    aboutCtaTitle: {
        type: String,
        default: 'Birlikte Tasarlayalım',
    },
    aboutCtaBody: {
        type: String,
        default: 'Projeniz için modüler raf çözümleri arıyorsanız, tasarım ekibimizle bir keşif görüşmesi planlayın.',
    },
    aboutCtaPrimaryLabel: {
        type: String,
        default: 'İletişime Geç',
    },
    aboutCtaPrimaryHref: {
        type: String,
        default: '/contact',
    },
    aboutCtaSecondaryLabel: {
        type: String,
        default: 'Ürünleri Gör',
    },
    aboutCtaSecondaryHref: {
        type: String,
        default: '/products',
    },

    // Contact Info
    contactEmail: {
        type: String,
        default: 'info@barkone.com',
    },
    contactPhone: {
        type: String,
        default: '+90 555 123 45 67',
    },
    contactAddress: {
        type: String,
        default: 'İstanbul, Türkiye',
    },

    // Company Info
    companyName: {
        type: String,
        default: 'barkOne Mobilya Ltd. Şti.',
    },
    companyDescription: {
        type: String,
        default: 'Modern ve minimalist duvar rafları ile yaşam alanlarınıza şıklık katın.',
    },

    // Testimonials
    testimonialsBadge: {
        type: String,
        default: 'Müşteri Yorumları',
    },
    testimonialsHeading: {
        type: String,
        default: 'Raf çözümlerimizi tercih edenlerin deneyimleri',
    },
    testimonialsDescription: {
        type: String,
        default: 'BarkOne raflarıyla yaşam alanlarını düzenleyen kullanıcılarımızın geri bildirimleri.',
    },
    testimonials: [{
        name: String,
        role: String,
        quote: String,
        rating: {
            type: Number,
            default: 5,
        },
    }],

    // Social Media
    socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String,
    },

    // Bank Info
    bankName: {
        type: String,
        default: 'X Bankası',
    },
    bankIban: {
        type: String,
        default: 'TR00 0000 0000 0000 0000 0000 00',
    },

    // Products Page Hero
    productsHeroTitle: {
        type: String,
        default: 'Tüm Ürünler',
    },
    productsHeroSubtitle: {
        type: String,
        default: 'Eviniz için en özel tasarımları keşfedin. Modern ve minimalist duvar raflarımızla yaşam alanlarınıza şıklık katın.',
    },
    productsHeroBadge: {
        type: String,
        default: 'Ürün Kataloğu',
    },
    productsHeroDescription: {
        type: String,
        default: 'Farklı ölçü, kaplama ve kullanım senaryolarına göre raf çözümlerimizi filtreleyin. İhtiyacınıza uygun modeli seçerken stok ve fiyat bilgisine hızlıca ulaşın.',
    },
    productsHeroSearchPlaceholder: {
        type: String,
        default: 'Ürün ara...',
    },
    productsHeroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2000&auto=format&fit=crop',
    },
    productsEmptyStateDescription: {
        type: String,
        default: 'Aradığınız kriterlere uygun ürün bulamadık. Filtreleri sıfırlayarak tüm seçkiye göz atabilirsiniz.',
    },
    productsEmptyStateCtaLabel: {
        type: String,
        default: 'Filtreleri Temizle',
    },

    // Contact Page Hero
    contactHeroTitle: {
        type: String,
        default: 'İletişim',
    },
    contactHeroSubtitle: {
        type: String,
        default: 'Sorularınız, önerileriniz veya özel sipariş talepleriniz için bizimle iletişime geçin.',
    },
    contactHeroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000&auto=format&fit=crop',
    },
    contactHeroBadge: {
        type: String,
        default: 'Müşteri Destek Ekibi',
    },
    contactCtaPrimaryLabel: {
        type: String,
        default: 'Destek ile İletişim',
    },
    contactCtaPrimaryHref: {
        type: String,
        default: '#destek',
    },
    contactCtaSecondaryLabel: {
        type: String,
        default: 'Randevu Talep Et',
    },
    contactCtaSecondaryHref: {
        type: String,
        default: '#appointment',
    },
    contactEmailPrimary: {
        type: String,
        default: 'info@barkone.com',
    },
    contactEmailSecondary: {
        type: String,
        default: 'destek@barkone.com',
    },
    contactPhone: {
        type: String,
        default: '+90 555 123 45 67',
    },
    contactPhoneHours: {
        type: String,
        default: 'Hafta içi 09:00 - 18:00',
    },
    contactAddress: {
        type: String,
        default: 'Mobilyacılar Sitesi, A Blok No: 12, Ümraniye, İstanbul',
    },
    contactSupportDescription: {
        type: String,
        default: 'Sipariş süreçleri, teslimat planlaması ve ürün soruları için destek ekibimiz yanınızda. Telefon, e-posta veya randevu seçeneklerinden dilediğinizi tercih edebilirsiniz.',
    },
    contactHeroDescription: {
        type: String,
        default: 'Sipariş süreçleri, teslimat planlaması ve ürün soruları için destek ekibimiz yanınızda. Telefon, e-posta veya randevu seçeneklerinden dilediğinizi tercih edebilirsiniz.',
    },
    contactMapEmbedUrl: {
        type: String,
        default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.981274921595!2d29.11467167674907!3d41.02963537134786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7e99389c9bb%3A0xf65794048bb2c0d7!2s%C3%9Cmran%C4%B0ye%20Mobilyac%C4%B1lar%20Sitesi!5e0!3m2!1str!2str!4v1732302560000!5m2!1str!2str',
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
