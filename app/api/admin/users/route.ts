import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        const ordersByUser = await Order.aggregate([
            { $match: { user: { $ne: null } } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
        ]);

        const orderCountMap = new Map<string, number>();
        for (const row of ordersByUser) {
            orderCountMap.set(String(row._id), row.count as number);
        }

        const payload = users.map((u: any) => ({
            id: String(u._id),
            name: u.name,
            email: u.email,
            role: u.role || 'user',
            createdAt: u.createdAt,
            orderCount: orderCountMap.get(String(u._id)) ?? 0,
        }));

        return NextResponse.json({ success: true, data: payload });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { id, name, email, role } = await request.json();

        if (!id) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        // Kullanıcının siparişlerini kontrol et
        const userOrders = await Order.countDocuments({ user: id });
        if (userOrders > 0) {
            return NextResponse.json({ 
                success: false, 
                error: 'Cannot delete user with existing orders' 
            }, { status: 400 });
        }

        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Failed to delete user' }, { status: 500 });
    }
}
