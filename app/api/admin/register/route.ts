import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, password } = await request.json();

        // Check if any admin exists
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return NextResponse.json({ success: false, error: 'Admin already exists' }, { status: 403 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            username,
            passwordHash,
        });

        return NextResponse.json({ success: true, message: 'Admin created successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
