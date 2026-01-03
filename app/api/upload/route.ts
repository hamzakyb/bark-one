import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({
                success: false,
                error: 'Dosya seçilmedi veya geçersiz dosya formatı'
            }, { status: 400 });
        }

        const blob = await put(file.name, file, {
            access: 'public',
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
