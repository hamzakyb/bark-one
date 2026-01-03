const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schemas locally to avoid import issues in script
const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        images: [{ type: String }],
        specifications: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MONGODB_URI = 'mongodb://localhost:27017/bark-one';

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

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
