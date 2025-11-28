import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createId } from '@paralleldrive/cuid2';

// https://github.com/nextauthjs/next-auth/issues/9493#issuecomment-1871601543
import type { Adapter } from 'next-auth/adapters';

import prisma from '@/lib/prisma';
import { UpdataSessionSchema } from '@/lib';
import sendVerificationRequest from '@/lib/sendVerificationRequest';
import { EMAIL_FROM } from '@/constants';
import { authConfig } from './auth.config';
import { handleZodError } from '@/utils';

export var { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma) as Adapter,
	providers: [
		Google({
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
		Resend({
			from: EMAIL_FROM,
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
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
		async signIn({ account, profile }) {
			if (account?.provider === 'google') {
				return Boolean(profile?.email_verified);
			}
			return true;
		},
		async jwt({
			token,
			user,
			trigger,
			session,
			// account
		}) {
			if (user) {
				// User is available during sign-in
				token.id = user.id!;
				token.learningLanguage = user.learningLanguage;
				token.nativeLanguage = user.nativeLanguage;
				token.EnglishIPAFlavour = user.EnglishIPAFlavour;
				token.image = user.image || null;
			}
			// updating session with client update call
			if (trigger === 'update' && session) {
				let result = UpdataSessionSchema.safeParse(session);
				if (result.success) {
					token = {
						...token,
						...result.data,
					};
				} else {
					console.error('Invalid session update payload', handleZodError(result.error, 'prettify'));
				}
			}
			return token;
		},
		session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					EnglishIPAFlavour: token.EnglishIPAFlavour,
					learningLanguage: token.learningLanguage,
					nativeLanguage: token.nativeLanguage,
					image: token.image,
				},
				error: token.error,
			};
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
