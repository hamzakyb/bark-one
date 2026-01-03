import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { reference, ...rest } = body;

        // Validate stock and calculate total amount securely
        let totalAmount = 0;
        const items = [];

        for (const item of body.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({ success: false, error: `Product ${item.product} not found` }, { status: 404 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({ success: false, error: `Insufficient stock for ${product.name}` }, { status: 400 });
            }

            totalAmount += product.price * item.quantity;
            items.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // Decrease stock
            product.stock -= item.quantity;
            await product.save();
        }

        const providedReference = typeof reference === 'string' ? reference.trim() : '';
        const orderNumber = providedReference || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Try to resolve authenticated user
        let userId: string | undefined;
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get('user_token')?.value;
            if (token) {
                const payload = jwt.verify(token, JWT_SECRET) as { id: string };
                userId = payload.id;
            }
        } catch {
            // kullanıcı olmadan da sipariş alınabilsin, sessiz geç
        }

        // Create order
        const order = await Order.create({
            ...rest,
            items,
            totalAmount,
            orderNumber,
            status: 'Pending',
            paymentMethod: body.paymentMethod ?? 'Havale/EFT',
            user: userId,
        });

        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create order';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('items.product');
        return NextResponse.json({ success: true, data: orders });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}
