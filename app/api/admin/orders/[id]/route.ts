import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(
            params.id,
            { status },
            { new: true },
        ).populate('items.product');

        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? 'Failed to update order' }, { status: 500 });
    }
}
