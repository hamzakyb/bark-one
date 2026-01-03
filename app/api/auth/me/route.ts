import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('user_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Oturum bulunamadı' }, { status: 401 });
        }

        let payload: any;
        try {
            payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        } catch {
            return NextResponse.json({ success: false, error: 'Oturum süresi dolmuş' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(payload.id).select('_id name email createdAt');
        if (!user) {
            return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Profil bilgisi alınamadı' }, { status: 500 });
    }
}
