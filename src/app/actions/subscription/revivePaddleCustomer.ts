'use server';

import { EmailSchema } from '@/lib';
import prisma from '@/lib/prisma';
import { handleZodError } from '@/utils';

// TODO remove console logs

export default async function revivePaddleCustomer(data: unknown): Promise<{ data: string } | { error: string }> {
	let result = EmailSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error);
		return { error: error.formErrors[0] };
	}

	let email = result.data;

	try {
		let checkForExistingCustomerUrl = `https://sandbox-api.paddle.com/customers?email=${email}`;
		let checkResponse = await fetch(checkForExistingCustomerUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
		});
		if (!checkResponse.ok) {
			let data = await checkResponse.json();
			let fieldErrors: string = '';
			if (data.error.errors) {
				fieldErrors = data.error.errors.map((err: { field: string; message: string }) => `${err.field} : ${err.message}.`).join(' ');
			}
			throw new Error(
				`${checkResponse.statusText}\nError code: ${data.error.code}\nError detail: ${data.error.detail}${
					fieldErrors ? `\nField Errors: ${fieldErrors}` : ''
				}`
			);
		}

		let checkResult = await checkResponse.json();
		console.log(checkResult, 'checkResult');

		let existingCustomerId: string | undefined = undefined;
		if (checkResult.data.length !== 0) {
			if (checkResult.data[0].status === 'active') {
				// the archive action might be failed when user deleted their account
				return { data: 'Paddle Customer is active' };
			}

			existingCustomerId = checkResult.data[0].id;

			console.log(existingCustomerId, 'foundCustomer');
		}

		let updateCustomerInfoUrl = `https://sandbox-api.paddle.com/customers/${existingCustomerId}`;
		let response = await fetch(updateCustomerInfoUrl, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status: 'active' }),
		});

		if (!response.ok) {
			let data = await response.json();
			let fieldErrors: string = '';
			if (data.error.errors) {
				fieldErrors = data.error.errors.map((err: { field: string; message: string }) => `${err.field} : ${err.message}.`).join(' ');
			}
			throw new Error(
				`${response.statusText}\nError code: ${data.error.code}\nError detail: ${data.error.detail}${
					fieldErrors ? `\nField Errors: ${fieldErrors}` : ''
				}`
			);
		}

		await prisma.user.update({
			where: {
				email,
			},
			data: {
				paddleCustomerId: existingCustomerId,
			},
		});

		return { data: 'Successfully revived Paddle customer.' };
	} catch (error) {
		console.error('Failed to revive Paddle customer', error);
		return { error: 'Failed to revive Paddle customer.' };
	}
}
