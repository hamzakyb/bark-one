'use server';

import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
        throw new Error('Dosya seçilmedi');
    }

    try {
        const blob = await put(file.name, file, {
            access: 'public',
        });

        return {
            success: true,
            url: blob.url,
        };
    } catch (error) {
        console.error('Blob upload error:', error);
        return {
            success: false,
            error: 'Görsel yüklenirken bir hata oluştu',
        };
    }
}
