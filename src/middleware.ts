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
