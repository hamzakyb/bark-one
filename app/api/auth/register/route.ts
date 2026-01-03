import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, error: 'Eksik alanlar var' }, { status: 400 });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Bu e-posta ile zaten kayıtlı bir hesap var' }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, passwordHash });

        return NextResponse.json({ success: true, data: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Kayıt işlemi başarısız' }, { status: 500 });
    }
}
