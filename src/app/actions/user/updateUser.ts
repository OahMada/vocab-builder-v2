'use server';

import prisma from '@/lib/prisma';
import verifySession from '@/lib/dal';
import { handleZodError } from '@/utils';
import { UpdateUserInputSchema, User, userSelect } from '@/lib';

export default async function updateUser(data: unknown): Promise<{ error: string } | { data: User }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;

	let result = UpdateUserInputSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error: error };
	}

	switch (result.data.action) {
		case 'personalize':
			try {
				let { name, learningLanguage, nativeLanguage, EnglishIPAFlavour } = result.data;
				let updatedUser = await prisma.user.update({
					where: { id: userId },
					data: {
						name: name || session.name,
						learningLanguage,
						nativeLanguage,
						EnglishIPAFlavour: EnglishIPAFlavour ?? null,
					},
					select: userSelect,
				});
				return { data: updatedUser };
			} catch (error) {
				console.error('user update failed', error);
				return { error: 'Failed to update user' };
			}
		case 'user-info':
			try {
				let { name, email } = result.data;
				let updatedUser = await prisma.user.update({
					where: { id: userId },
					data: {
						name,
						email,
					},
					select: userSelect,
				});
				return { data: updatedUser };
			} catch (error) {
				console.error('user update failed', error);
				return { error: 'Failed to update user' };
			}
		default:
			return { error: `Unhandled user update action: ${result.data['action']}` };
	}
}
