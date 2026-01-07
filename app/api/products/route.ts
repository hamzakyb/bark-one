import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            name,
            slug,
            description,
            price,
            stock,
            images = [],
            specifications = {},
            category,
        } = body;

        if (!name || !slug || !description) {
            return NextResponse.json({ error: 'Lütfen ürün adı, slug ve açıklama alanlarını doldurun.' }, { status: 400 });
        }

        const numericPrice = typeof price === 'number' ? price : Number(price);
        const numericStock = typeof stock === 'number' ? stock : Number(stock);

        if (Number.isNaN(numericPrice) || Number.isNaN(numericStock)) {
            return NextResponse.json({ error: 'Fiyat ve stok sayısal değer olmalıdır.' }, { status: 400 });
        }

        const existing = await Product.findOne({ slug }).lean();
        if (existing) {
            return NextResponse.json({ error: 'Bu slug ile kayıtlı bir ürün zaten mevcut.' }, { status: 409 });
        }

        const product = await Product.create({
            name,
            slug,
            description,
            price: numericPrice,
            stock: numericStock,
            images,
            specifications,
            category: category ?? 'signature',
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Ürün oluşturulurken bir hata oluştu.' }, { status: 500 });
    }
}
