import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from './ProductCard';
import MOCK_PRODUCTS from '@/lib/mockProducts';

type BaseProduct = {
    _id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    slug?: string;
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1616627562221-877ed9b674b1?q=80&w=1200&auto=format&fit=crop';

function normalizeProduct(data: unknown): BaseProduct {
    if (!data || typeof data !== 'object') {
        return {
            _id: '',
            name: 'BarkOne Raf',
            price: 0,
            images: [FALLBACK_IMAGE],
            description: '',
        };
    }

    const record = data as Record<string, unknown>;
    const rawId = record._id;
    const id = typeof rawId === 'string'
        ? rawId
        : rawId && typeof rawId === 'object' && 'toString' in rawId
            ? String((rawId as { toString(): string }).toString())
            : '';

    const images = Array.isArray(record.images) && record.images.length > 0
        ? record.images.filter((img): img is string => typeof img === 'string')
        : [FALLBACK_IMAGE];

    const priceValue = record.price;

    return {
        _id: id,
        name: typeof record.name === 'string' ? record.name : 'BarkOne Raf',
        price: typeof priceValue === 'number' ? priceValue : Number(priceValue ?? 0) || 0,
        images,
        description: typeof record.description === 'string' ? record.description : '',
        slug: typeof record.slug === 'string' ? record.slug : undefined,
    };
}

async function getRelatedProducts(currentProductId: string): Promise<BaseProduct[]> {
    try {
        await dbConnect();
        const products = await Product.find({ _id: { $ne: currentProductId } })
            .limit(4)
            .lean();

        if (products.length > 0) {
            return products.map((product) => normalizeProduct(product)).filter((product) => product._id !== currentProductId);
        }
    } catch {
        // ignore and fallback to mock data
    }

    return MOCK_PRODUCTS
        .filter((product) => product._id !== currentProductId)
        .slice(0, 4)
        .map((product) => normalizeProduct(product));
}

export default async function RelatedProducts({ currentProductId }: { currentProductId: string }) {
    const products = await getRelatedProducts(currentProductId);

    if (products.length === 0) return null;

    return (
        <section className="py-16 border-t border-gray-100 mt-16">
            <h2 className="text-2xl font-bold text-anthracite mb-8">Bunları da Beğenebilirsiniz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
