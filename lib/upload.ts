'use server';

import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return {
                success: false,
                error: 'Dosya seçilmedi veya geçersiz dosya formatı',
            };
        }

        const blob = await put(file.name, file, {
            access: 'public',
        });

        return {
            success: true,
            url: blob.url,
        };
    } catch (error: any) {
        console.error('Blob upload error:', error);
        return {
            success: false,
            error: error.message || 'Görsel yüklenirken bir hata oluştu',
        };
    }
}
