import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createId } from '@paralleldrive/cuid2';

import prisma from '@/lib/prisma';
import sendVerificationRequest from '@/lib/sendVerificationRequest';

export var { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Resend({
			from: process.env.EMAIL_FROM,
			sendVerificationRequest,
			normalizeIdentifier(identifier: string): string {
				// https://authjs.dev/getting-started/providers/resend#normalizing-email-addresses
				// Get the first two elements only, separated by `@` from user input.
				let [local, domain] = identifier.toLowerCase().trim().split('@');
				// The part before "@" can contain a ",", but we remove it on the domain part.
				domain = domain.split(',')[0];
				return `${local}@${domain}`;
			},
			generateVerificationToken() {
				return createId();
			},
		}),
	],
	callbacks: {
		async redirect({ url, baseUrl }) {
			return baseUrl; // open home page after login
		},
		jwt({ token, user }) {
			if (user) {
				// User is available during sign-in
				token.id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			session.user.id = token.id!;
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
		// how long (seconds) a user's session is valid before expiring
		maxAge: 2592000, // 30days
	},
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
});
