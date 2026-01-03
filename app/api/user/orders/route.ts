import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('user_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Oturum bulunamadı' }, { status: 401 });
        }

        let payload: { id: string };
        try {
            payload = jwt.verify(token, JWT_SECRET) as { id: string };
        } catch {
            return NextResponse.json({ success: false, error: 'Oturum süresi dolmuş' }, { status: 401 });
        }

        await dbConnect();

        const orders = await Order.find({ user: payload.id })
            .sort({ createdAt: -1 })
            .populate('items.product');

        return NextResponse.json({ success: true, data: orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Siparişler alınamadı' }, { status: 500 });
    }
}
