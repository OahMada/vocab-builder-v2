// import NextAuth from 'next-auth';
// import { NextResponse } from 'next/server';
// import { authConfig } from '@/auth.config';

// import { ALLOWED_ORIGINS } from '@/constants';

// var { auth } = NextAuth(authConfig);

// export default auth((req) => {
// 	let { nextUrl } = req;
// 	let origin = req.headers.get('origin') || '';

// 	// Preflight
// 	if (req.method === 'OPTIONS') {
// 		let preflight = NextResponse.next();
// 		if (ALLOWED_ORIGINS.includes(origin)) {
// 			preflight.headers.set('Access-Control-Allow-Origin', origin);
// 			preflight.headers.set('Access-Control-Allow-Credentials', 'true');
// 			preflight.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
// 			preflight.headers.set(
// 				'Access-Control-Allow-Headers',
// 				'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
// 			);
// 		}
// 		return preflight;
// 	}

// 	// Redirect www -> root
// 	if (nextUrl.hostname === 'www.vocab-builder.app') {
// 		let redirectUrl = new URL(req.url);
// 		redirectUrl.hostname = 'vocab-builder.app';
// 		let redirectRes = NextResponse.redirect(redirectUrl);
// 		if (ALLOWED_ORIGINS.includes(origin)) {
// 			redirectRes.headers.set('Access-Control-Allow-Origin', origin);
// 			redirectRes.headers.set('Access-Control-Allow-Credentials', 'true');
// 		}
// 		return redirectRes;
// 	}

// 	// Auth check
// 	let isAuthenticated = !!req.auth;
// 	let protectedRegex = [/^\/$/, /^\/browse$/, /^\/account$/, /^\/personalize$/, /^\/sentence\/.+/];
// 	let isProtectedRoute = protectedRegex.some((regex) => regex.test(nextUrl.pathname));

// 	if (isProtectedRoute && !isAuthenticated) {
// 		let loginPath =
// 			nextUrl.pathname === '/'
// 				? '/intro'
// 				: nextUrl.pathname === '/personalize'
// 				? '/auth/login'
// 				: `/auth/login?callback=${encodeURIComponent(nextUrl.pathname + nextUrl.search)}`;
// 		let redirectRes = NextResponse.redirect(new URL(loginPath, nextUrl));
// 		if (ALLOWED_ORIGINS.includes(origin)) {
// 			redirectRes.headers.set('Access-Control-Allow-Origin', origin);
// 			redirectRes.headers.set('Access-Control-Allow-Credentials', 'true');
// 		}
// 		return redirectRes;
// 	}

// 	// Normal response
// 	const res = NextResponse.next();
// 	if (ALLOWED_ORIGINS.includes(origin)) {
// 		res.headers.set('Access-Control-Allow-Origin', origin);
// 		res.headers.set('Access-Control-Allow-Credentials', 'true');
// 	}
// 	return res;
// });

// export const config = {
// 	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

// https://blog.logrocket.com/auth-js-client-side-authentication-next-js/#protecting-routes-middleware

import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

var { auth } = NextAuth(authConfig);

export default auth((req) => {
	let { nextUrl } = req;
	// req.auth is provided by Auth.js
	// console.log('req.auth.user: ' + req.auth?.user?.email);
	// set isAuthenticated to true if req.auth is a truthy value. otherwise set to false.
	let isAuthenticated = !!req.auth;
	// use boolean value to determine if the requested route is a protected route
	const protectedRegex = [/^\/$/, /^\/browse$/, /^\/account$/, /^\/personalize$/, /^\/sentence\/.+/];
	let isProtectedRoute = protectedRegex.some((regex) => regex.test(nextUrl.pathname));
	// redirect to signin if route is a protected route and user is not authenticated
	if (isProtectedRoute && !isAuthenticated) {
		if (nextUrl.pathname === '/') {
			return Response.redirect(new URL('/intro', nextUrl));
		}

		if (nextUrl.pathname === '/personalize') {
			return Response.redirect(new URL('/auth/login', nextUrl));
		}
		return Response.redirect(new URL(`/auth/login?callback=${nextUrl.pathname}`, nextUrl));
	}
});

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
