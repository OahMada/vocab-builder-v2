// https://blog.logrocket.com/auth-js-client-side-authentication-next-js/#protecting-routes-middleware

import { auth } from '@/auth';

export default auth((req) => {
	let { nextUrl } = req;
	// req.auth is provided by Auth.js
	// console.log('req.auth.user: ' + req.auth?.user?.email);

	// set isAuthenticated to true if req.auth is a truthy value. otherwise set to false.
	let isAuthenticated = !!req.auth;

	// use boolean value to determine if the requested route is a protected route
	const protectedRegex = [/^\/$/, /^\/browse$/, /^\/account$/, /^\/sentence\/.+/];
	let isProtectedRoute = protectedRegex.some((regex) => regex.test(nextUrl.pathname));

	// redirect to signin if route is a protected route and user is not authenticated
	if (isProtectedRoute && !isAuthenticated) return Response.redirect(new URL('/auth/login', nextUrl));
});

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
