import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    try {
        await connectDB();

        let settings = await SiteSettings.findOne();
        console.log('GET /api/settings - Found settings ID:', settings?._id?.toString() || 'none');

        // If no settings exist, create default
        if (!settings) {
            settings = await SiteSettings.create({});
            console.log('GET /api/settings - Created default settings with ID:', settings._id.toString());
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const {
            _id: _ignoredId,
            __v: _ignoredVersion,
            createdAt: _ignoredCreatedAt,
            updatedAt: _ignoredUpdatedAt,
            ...rest
        } = data ?? {};

        let settings = await SiteSettings.findOne();

        const updatePayload = {
            ...rest,
            updatedAt: new Date(),
        };

        settings = await SiteSettings.findOneAndUpdate(
            {},
            { $set: updatePayload },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        console.log('POST /api/settings - Successfully updated document ID:', settings?._id?.toString());

        const serialized = settings?.toObject ? settings.toObject() : settings;

        return NextResponse.json({ success: true, data: serialized });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
