import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

import { ALLOWED_ORIGINS } from '@/constants';

var { auth } = NextAuth(authConfig);

export default auth((req) => {
	let { nextUrl } = req;
	let origin = req.headers.get('origin') || '';

	// Preflight
	if (req.method === 'OPTIONS') {
		let preflight = NextResponse.next();
		if (ALLOWED_ORIGINS.includes(origin)) {
			preflight.headers.set('Access-Control-Allow-Origin', origin);
			preflight.headers.set('Access-Control-Allow-Credentials', 'true');
			preflight.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
			preflight.headers.set(
				'Access-Control-Allow-Headers',
				'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
			);
		}
		return preflight;
	}

	// Redirect www -> root
	if (nextUrl.hostname === 'www.vocab-builder.app') {
		let redirectUrl = new URL(req.url);
		redirectUrl.hostname = 'vocab-builder.app';
		let redirectRes = NextResponse.redirect(redirectUrl);
		if (ALLOWED_ORIGINS.includes(origin)) {
			redirectRes.headers.set('Access-Control-Allow-Origin', origin);
			redirectRes.headers.set('Access-Control-Allow-Credentials', 'true');
		}
		return redirectRes;
	}

	// Auth check
	let isAuthenticated = !!req.auth;
	let protectedRegex = [/^\/$/, /^\/browse$/, /^\/account$/, /^\/personalize$/, /^\/sentence\/.+/];
	let isProtectedRoute = protectedRegex.some((regex) => regex.test(nextUrl.pathname));

	if (isProtectedRoute && !isAuthenticated) {
		let loginPath =
			nextUrl.pathname === '/'
				? '/intro'
				: nextUrl.pathname === '/personalize'
				? '/auth/login'
				: `/auth/login?callback=${encodeURIComponent(nextUrl.pathname + nextUrl.search)}`;
		let redirectRes = NextResponse.redirect(new URL(loginPath, nextUrl));
		if (ALLOWED_ORIGINS.includes(origin)) {
			redirectRes.headers.set('Access-Control-Allow-Origin', origin);
			redirectRes.headers.set('Access-Control-Allow-Credentials', 'true');
		}
		return redirectRes;
	}

	// Normal response
	let res = NextResponse.next();
	if (ALLOWED_ORIGINS.includes(origin)) {
		res.headers.set('Access-Control-Allow-Origin', origin);
		res.headers.set('Access-Control-Allow-Credentials', 'true');
	}
	return res;
});

export var config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
