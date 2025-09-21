import NextAuth, { type DefaultSession } from 'next-auth';

interface UserFields {
	id: string;
	learningLanguage: string | null;
	nativeLanguage: string | null;
	EnglishIPAFlavour: string | null;
}

declare module 'next-auth' {
	interface User extends UserFields {}
	interface Session {
		user: UserFields & DefaultSession['user'];
	}
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
	interface JWT extends UserFields {}
}
