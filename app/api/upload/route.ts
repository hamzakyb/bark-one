import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (
                pathname,
                /* clientPayload */
            ) => {
                // Burada yetkilendirme kontrolü yapabilirsiniz (örn: admin mi?)
                // Şimdilik bark-one için herkese açık (admin panelinde olunduğu varsayılıyor)
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                    addRandomSuffix: true,
                    tokenPayload: JSON.stringify({
                        // Ekstra veri göndermek isterseniz buraya ekleyebilirsiniz
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Yükleme tamamlandığında yapılacak işlemler (opsiyonel)
                console.log('Blob upload completed:', blob, tokenPayload);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
