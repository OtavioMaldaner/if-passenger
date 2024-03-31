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

    var hoje = new Date();

    var expiracao = new Date(hoje);
    expiracao.setHours(23, 59, 59, 999);

    var expiracaoFormatada = expiracao.toUTCString();

    return NextResponse.next({
        headers: {
            'Set-Cookie': `accessedToday=true; path=/; expires=${expiracaoFormatada}`,
        },
    });
}

export const config = {
    matcher: ['/register/:path*', '/homepage', '/user/:path*', '/trips/:path*', '/notifications']
};
