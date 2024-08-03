import { NextRequest, NextResponse } from "next/server";

const signInUrl = `http://localhost:3000/`;

export function middleware(request: NextRequest) {
    const token = request.cookies.get('user_token')?.value;

    if (!token) {
        return NextResponse.redirect(signInUrl, {
            headers: {
                'Set-Cookie': [
                    `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20`,
                    'accessedToday=false; path=/; expires=1970-01-01T00:00:00.000Z; max-age=1'
                ],
            },
        });
    }
}

export const config = {
    matcher: ['/register/:path*', '/homepage', '/user/:path*', '/trips/:path*', '/notifications']
};
