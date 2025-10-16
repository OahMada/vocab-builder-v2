'use server';
import { signIn } from '@/auth';

export default async function demoLogin(): Promise<void> {
	await signIn('credentials', { redirectTo: '/' });
}
