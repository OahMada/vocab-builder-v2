'use server';
import { signOut } from '@/auth';

export default async function logout(): Promise<void> {
	await signOut({ redirectTo: '/intro' });
}
