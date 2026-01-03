import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
        const { base64, fileName, contentType } = await request.json();

        if (!base64) {
            return NextResponse.json({
                success: false,
                error: 'Görsel verisi eksik'
            }, { status: 400 });
        }

        // Convert base64 to buffer
        const base64Data = base64.split(',')[1] || base64;
        const buffer = Buffer.from(base64Data, 'base64');

        const blob = await put(fileName || 'image.webp', buffer, {
            access: 'public',
            contentType: contentType || 'image/webp',
        });

        return NextResponse.json({
            success: true,
            url: blob.url,
        });
    } catch (error: any) {
        console.error('API Upload error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Görsel yüklenirken bir hata oluştu'
        }, { status: 500 });
    }
}
