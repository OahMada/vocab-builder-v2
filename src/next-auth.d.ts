import NextAuth, { type DefaultSession } from 'next-auth';
import { LEARNING_LANGUAGE, NATIVE_LANGUAGE, ENGLISH_IPA_FLAVOUR } from '@/constants';

interface UserFields {
	id: string;
	learningLanguage: (typeof LEARNING_LANGUAGE)[number] | null;
	nativeLanguage: (typeof NATIVE_LANGUAGE)[number] | null;
	EnglishIPAFlavour: (typeof ENGLISH_IPA_FLAVOUR)[number] | null;
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
