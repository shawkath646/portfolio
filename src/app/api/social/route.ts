import { NextRequest, NextResponse } from 'next/server';
import getSocialLinks from "@/actions/dataFetch/getSocialLinks";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const platform = searchParams.get('platform')?.toLowerCase();
        const redirect = searchParams.get('redirect') === 'true';

        const socialLinks = await getSocialLinks();

        if (!platform) {
            return NextResponse.json(socialLinks);
        }

        const platformUrl = socialLinks[platform as keyof typeof socialLinks];

        if (!platformUrl) {
            return NextResponse.json(
                { 
                    error: `Platform '${platform}' not found`,
                    availablePlatforms: Object.keys(socialLinks)
                },
                { status: 404 }
            );
        }

        if (redirect) {
            return NextResponse.redirect(platformUrl, 301);
        }

        return NextResponse.json({
            platform,
            url: platformUrl
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}