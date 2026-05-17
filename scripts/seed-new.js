import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env file!');
    process.exit(1);
}

// 1. Define schemas locally to avoid TS/alias import complications
const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        images: [{ type: String }],
        specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const SiteSettingsSchema = new mongoose.Schema({
    siteLogoLight: { type: String, default: '' },
    siteLogoDark: { type: String, default: '' },
    adminLogo: { type: String, default: '' },
    homeHeroBadge: { type: String, default: 'Raf Çözümleri' },
    homeHeroTitle: { type: String, default: 'Modern Duvar Rafları' },
    homeHeroSubtitle: { type: String, default: 'Minimalist tasarımlarla yaşam alanlarınıza şıklık katın' },
    homeHeroImage: { type: String, default: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2400&auto=format&fit=crop' },
    homeHeroPrimaryCtaLabel: { type: String, default: 'Rafları İncele' },
    homeHeroPrimaryCtaUrl: { type: String, default: '/products' },
    homeHeroSecondaryCtaLabel: { type: String, default: 'Destek Al' },
    homeHeroSecondaryCtaUrl: { type: String, default: '/contact' },
    homeHeroVerticalText: { type: String, default: 'Premium Craftsmanship' },
    homeHeroSlides: [{
        badge: String,
        title: String,
        subtitle: String,
        image: String,
        primaryCtaLabel: String,
        primaryCtaUrl: String,
        secondaryCtaLabel: String,
        secondaryCtaUrl: String,
    }],
    featuresBadge: { type: String, default: 'BarkOne Raf Sistemleri' },
    featuresHeading: { type: String, default: 'Güven veren raflar için üç temel sözümüz' },
    featuresDescription: { type: String, default: 'Dayanıklı malzeme, özenli üretim ve uzun ömürlü kullanım. Yaşam alanınıza uygun raf çözümünü kolayca seçmeniz için her detayı netleştiriyoruz.' },
    features: [{ title: String, description: String, icon: String, highlight: String }],
    spotlightBadge: { type: String, default: 'Raf Ürünlerimiz' },
    spotlightHeading: { type: String, default: 'Öne çıkan duvar rafları' },
    spotlightDescription: { type: String, default: 'Oturma odasından çalışma alanına kadar düzen ve depolama sağlayan raf çözümlerimizi keşfedin.' },
    spotlightCtaLabel: { type: String, default: 'Tüm Ürünleri Gör' },
    spotlightCtaUrl: { type: String, default: '/products' },
    spotlightItems: [{ title: String, description: String, price: String, image: String, href: String }],
    galleryBadge: { type: String, default: 'Galeri' },
    galleryHeading: { type: String, default: 'Yaşam alanınıza ilham veren sahneler' },
    galleryDescription: { type: String, default: 'Ürünlerimizi mekânınızın farklı zonlarına taşıyarak dengeyi keşfedin.' },
    galleryItems: [{ image: String, label: String, tag: String, span: String, aspectRatio: String }],
    aboutHeroBadge: { type: String, default: 'Hakkımızda' },
    aboutHeroTitle: { type: String, default: 'BarkOne ile yaşam alanlarınıza düzen, sıcaklık ve karakter katıyoruz' },
    aboutHeroSubtitle: { type: String, default: 'İstanbul’daki atölyemizde ürettiğimiz modüler duvar rafları; fonksiyonel tasarımı, sürdürülebilir malzemeleri ve butik üretim anlayışıyla öne çıkıyor.' },
    aboutHeroImage: { type: String, default: '/images/about-hero-luxury.png' },
    aboutIntroTitle: { type: String, default: 'Biz Kimiz?' },
    aboutIntroBody: { type: String, default: 'BarkOne, modüler raf sistemlerini merkezi konut ve ticari projeler için özelleştiren bağımsız bir tasarım kolektifidir. 2016’dan bu yana iç mimarlar, mimarlık ofisleri ve ev sahipleriyle birlikte çalışarak, her yaşam alanının özgün bir hikâyesi olduğuna inanıyoruz.' },
    aboutIntroSecondaryBody: { type: String, default: 'Üretim süreçlerimizde yerel tedarik zincirleriyle çalışıyor, her rafı sipariş üzerine hazırlıyoruz. Böylece stok fazlasını ortadan kaldırırken, malzeme verimliliğini en üst seviyeye çıkarıyoruz.' },
    aboutWorkshopTitle: { type: String, default: 'Atölyemiz' },
    aboutWorkshopBody: { type: String, default: 'Masif meşe, ceviz ve fırınlanmış çam gibi doğal malzemeleri, toz boyalı çelik aksesuarlarla birleştiriyoruz. Her modül, CNC kesim ve el işçiliği sayesinde kusursuz birleşimlere sahip.' },
    aboutStats: [{ icon: String, title: String, description: String }],
    aboutValues: [{ icon: String, title: String, description: String }],
    aboutProcessTitle: { type: String, default: 'Nasıl Çalışıyoruz?' },
    aboutProcessItems: [{ title: String, description: String }],
    aboutTeamBody: { type: String, default: 'Endüstriyel tasarımcılar, marangozlar ve proje yöneticilerinden oluşan ekibimiz, yerel üretimin sürdürülebilirliğine inanıyor.' },
    aboutTeamTags: [String],
    aboutCtaTitle: { type: String, default: 'Birlikte Tasarlayalım' },
    aboutCtaBody: { type: String, default: 'Projeniz için modüler raf çözümleri arıyorsanız, tasarım ekibimizle bir keşif görüşmesi planlayın.' },
    aboutCtaPrimaryLabel: { type: String, default: 'İletişime Geç' },
    aboutCtaPrimaryHref: { type: String, default: '/contact' },
    aboutCtaSecondaryLabel: { type: String, default: 'Ürünleri Gör' },
    aboutCtaSecondaryHref: { type: String, default: '/products' },
    contactEmail: { type: String, default: 'info@barkone.com' },
    contactPhone: { type: String, default: '+90 555 123 45 67' },
    companyName: { type: String, default: 'barkOne Mobilya Ltd. Şti.' },
    companyDescription: { type: String, default: 'Modern ve minimalist duvar rafları ile yaşam alanlarınıza şıklık katın.' },
    testimonialsBadge: { type: String, default: 'Müşteri Yorumları' },
    testimonialsHeading: { type: String, default: 'Raf çözümlerimizi tercih edenlerin deneyimleri' },
    testimonialsDescription: { type: String, default: 'BarkOne raflarıyla yaşam alanlarını düzenleyen kullanıcılarımızın geri bildirimleri.' },
    testimonials: [{ name: String, role: String, quote: String, rating: { type: Number, default: 5 } }],
    socialMedia: { instagram: String, facebook: String, twitter: String },
    bankName: { type: String, default: 'X Bankası' },
    bankIban: { type: String, default: 'TR00 0000 0000 0000 0000 0000 00' },
    productsHeroTitle: { type: String, default: 'Tüm Ürünler' },
    productsHeroSubtitle: { type: String, default: 'Eviniz için en özel tasarımları keşfedin. Modern ve minimalist duvar raflarımızla yaşam alanlarınıza şıklık katın.' },
    productsHeroBadge: { type: String, default: 'Ürün Kataloğu' },
    productsHeroDescription: { type: String, default: 'Farklı ölçü, kaplama ve kullanım senaryolarına göre raf çözümlerimizi filtreleyin. İhtiyacınıza uygun modeli seçerken stok ve fiyat bilgisine hızlıca ulaşın.' },
    productsHeroSearchPlaceholder: { type: String, default: 'Ürün ara...' },
    productsHeroImage: { type: String, default: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2000&auto=format&fit=crop' },
    productsEmptyStateDescription: { type: String, default: 'Aradığınız kriterlere uygun ürün bulamadık. Filtreleri sıfırlayarak tüm seçkiye göz atabilirsiniz.' },
    productsEmptyStateCtaLabel: { type: String, default: 'Filtreleri Temizle' },
    contactHeroTitle: { type: String, default: 'İletişim' },
    contactHeroSubtitle: { type: String, default: 'Sorularınız, önerileriniz veya özel sipariş talepleriniz için bizimle iletişime geçin.' },
    contactHeroImage: { type: String, default: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000&auto=format&fit=crop' },
    contactHeroBadge: { type: String, default: 'Müşteri Destek Ekibi' },
    contactCtaPrimaryLabel: { type: String, default: 'Destek ile İletişim' },
    contactCtaPrimaryHref: { type: String, default: '#destek' },
    contactCtaSecondaryLabel: { type: String, default: 'Randevu Talep Et' },
    contactCtaSecondaryHref: { type: String, default: '#appointment' },
    contactEmailPrimary: { type: String, default: 'info@barkone.com' },
    contactEmailSecondary: { type: String, default: 'destek@barkone.com' },
    contactPhoneHours: { type: String, default: 'Hafta içi 09:00 - 18:00' },
    contactAddress: { type: String, default: 'Mobilyacılar Sitesi, A Blok No: 12, Ümraniye, İstanbul' },
    contactSupportDescription: { type: String, default: 'Sipariş süreçleri, teslimat planlaması ve ürün soruları için destek ekibimiz yanınızda. Telefon, e-posta veya randevu seçeneklerinden dilediğinizi tercih edebilirsiniz.' },
    contactHeroDescription: { type: String, default: 'Sipariş süreçleri, teslimat planlaması ve ürün soruları için destek ekibimiz yanınızda. Telefon, e-posta veya randevu seçeneklerinden dilediğinizi tercih edebilirsiniz.' },
    contactMapEmbedUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.981274921595!2d29.11467167674907!3d41.02963537134786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7e99389c9bb%3A0xf65794048bb2c0d7!2s%C3%9Cmran%C4%B0ye%20Mobilyac%C4%B1lar%20Sitesi!5e0!3m2!1str!2str!4v1732302560000!5m2!1str!2str' },
    contactFormTitle: { type: String, default: 'Size nasıl yardımcı olabiliriz?' },
    contactFormSubtitle: { type: String, default: 'Formu doldurun, tasarım ekibimiz en kısa sürede sizinle iletişime geçsin.' },
    updatedAt: { type: Date, default: Date.now }
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

// Data
const products = [
    {
        name: "Minimalist Meşe Raf",
        slug: "minimalist-mese-raf",
        description: "Doğal meşe ağacından üretilmiş, gizli bağlantı aparatlı minimalist duvar rafı. Salon, yatak odası veya çalışma odanız için mükemmel bir tamamlayıcı.",
        price: 450.00,
        stock: 15,
        images: [
            "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=1000&auto=format&fit=crop"
        ],
        specifications: {
            material: "Masif Meşe",
            dimensions: "60 x 4 x 20 cm",
            color: "Doğal Ahşap"
        }
    },
    {
        name: "Endüstriyel Metal & Ahşap Raf",
        slug: "endustriyel-metal-ahsap-raf",
        description: "Siyah metal boru ayaklar ve eskitme ahşap rafların mükemmel uyumu. Loft ve endüstriyel tarz dekorasyonlar için ideal.",
        price: 850.00,
        stock: 8,
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop"
        ],
        specifications: {
            material: "Çam Ağacı & Metal",
            dimensions: "80 x 60 x 25 cm",
            color: "Ceviz & Siyah"
        }
    },
    {
        name: "Petek Duvar Rafı Seti",
        slug: "petek-duvar-rafi-seti",
        description: "Altıgen formunda 3'lü raf seti. İstediğiniz kombinasyonu oluşturarak duvarlarınızda modern bir sanat eseri yaratın.",
        price: 650.00,
        stock: 20,
        images: [
            "https://images.unsplash.com/photo-1534349762230-ee0cd87e108d?q=80&w=1000&auto=format&fit=crop"
        ],
        specifications: {
            material: "MDF Lam",
            dimensions: "30 x 26 x 10 cm (Her biri)",
            color: "Beyaz & Antrasit"
        }
    },
    {
        name: "Rustik Halatlı Raf",
        slug: "rustik-halatli-raf",
        description: "Jüt halat askılı, doğal ahşap dokulu dekoratif raf. Kitaplarınız ve bitkileriniz için bohem bir sergileme alanı.",
        price: 320.00,
        stock: 25,
        images: [
            "https://images.unsplash.com/photo-1505693416388-b0346efee535?q=80&w=1000&auto=format&fit=crop"
        ],
        specifications: {
            material: "Çam & Jüt Halat",
            dimensions: "50 x 15 x 2 cm",
            color: "Açık Ceviz"
        }
    }
];

const homeHeroSlides = [
    {
        badge: 'Atelier Serisi',
        title: 'Minimalizmin\nEn Saf Hali',
        subtitle: 'Studio Serisi ile sadeliğin gücünü keşfedin. Her parça, modern yaşamın karmaşasına huzurlu bir yanıt olarak tasarlandı.',
        image: '/images/hero-luxury-living.png',
        primaryCtaLabel: 'İncele',
        primaryCtaUrl: '/products',
        secondaryCtaLabel: 'İletişim',
        secondaryCtaUrl: '/contact',
    },
    {
        badge: 'Modern Collection',
        title: 'Zarafetin\nYeni Tanımı',
        subtitle: 'Modern yaşam alanları için özel tasarım raflar. Estetik ve fonksiyonelliği bir arada sunan özel koleksiyon.',
        image: '/images/hero-modern-dining.png',
        primaryCtaLabel: 'Koleksiyonu Keşfet',
        primaryCtaUrl: '/products?collection=modern',
        secondaryCtaLabel: 'Detaylı Bilgi',
        secondaryCtaUrl: '/contact',
    },
    {
        badge: 'Cozy Corner',
        title: 'Okuma Köşeniz\nİçin Mükemmel',
        subtitle: 'Kitaplarınız için en şık ve doğal çözüm. Ahşabın sıcaklığını evinize taşıyın.',
        image: '/images/hero-reading-corner.png',
        primaryCtaLabel: 'Şimdi Al',
        primaryCtaUrl: '/products?category=shelves',
        secondaryCtaLabel: 'İlham Al',
        secondaryCtaUrl: '/gallery',
    }
];

const defaultStats = [
    { icon: 'Ruler', title: '180+ Proje', description: 'Özel ölçü raf çözümlerini iç mimarlar ve konut sahipleri için hayata geçirdik.' },
    { icon: 'Users', title: '12 Kişilik Ekip', description: 'Tasarımdan montaja kadar süreci yöneten multidisipliner ekip.' },
    { icon: 'ShieldCheck', title: '2 Yıl Garanti', description: 'Tüm ürünlerimizde malzeme ve işçilik garantisi sunuyoruz.' },
];

const defaultValues = [
    { icon: 'Leaf', title: 'Sürdürülebilir Malzeme', description: 'Sertifikalı ormanlardan elde edilen masif ahşap ve geri dönüştürülebilir metal bileşenler kullanıyoruz.' },
    { icon: 'Sparkles', title: 'Zanaat & Teknoloji', description: 'El işçiliğini CNC üretimle buluşturup kusursuz yüzey kalitesi ve dayanıklılık sağlıyoruz.' },
    { icon: 'Users', title: 'İş Birlikçi Tasarım', description: 'Kullanıcı alışkanlıklarını dinleyip yaşam alanına özel modüler raf senaryoları geliştiriyoruz.' },
];

const defaultProcessItems = [
    { title: '1. Keşif & Analiz', description: 'Alan ölçüleri, depolama ihtiyaçları ve stil tercihlerini birlikte değerlendiriyoruz.' },
    { title: '2. Konsept & Render', description: '3B görsellerle raf kombinasyonlarını sunuyor, modüler seçenekleri birlikte netleştiriyoruz.' },
    { title: '3. Üretim & Kurulum', description: 'Atölyemizde üretilen parçalar, uzman montaj ekibimiz tarafından kuruluyor.' },
];

const defaultFeatures = [
    { title: "Sürdürülebilir Ormancılık", description: "Yalnızca sertifikalı ve yenilenebilir ormanlardan elde edilen ahşapları işliyoruz.", icon: "Leaf", highlight: "Doğal & Ekolojik" },
    { title: "Kusursuz İşçilik", description: "El emeği detayları CNC kesim teknolojisiyle birleştirip milimetrik uyum yakalıyoruz.", icon: "Sparkles", highlight: "Premium Standart" },
    { title: "Modüler Tasarım", description: "Yaşam alanınızın büyüklüğüne göre genişletilebilir raf üniteleri tasarlıyoruz.", icon: "Layout", highlight: "Esnek Kullanım" }
];

async function seed() {
    try {
        console.log('Connecting to new MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        // 1. Seed Products
        await Product.deleteMany({});
        console.log('Cleared old products.');
        const insertedProducts = await Product.insertMany(products);
        console.log(`Successfully seeded ${insertedProducts.length} products!`);

        // 2. Seed SiteSettings
        await SiteSettings.deleteMany({});
        console.log('Cleared old site settings.');
        
        const settings = new SiteSettings({
            homeHeroSlides: homeHeroSlides,
            aboutStats: defaultStats,
            aboutValues: defaultValues,
            aboutProcessItems: defaultProcessItems,
            features: defaultFeatures,
            updatedAt: new Date()
        });
        
        await settings.save();
        console.log('Successfully seeded default Site Settings!');

        console.log('All seeding operations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
