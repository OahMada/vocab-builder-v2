'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import logout from '@/app/actions/auth/logout';
import deleteUser from '@/app/actions/user/deleteUser';

import { DeleteUserInputSchema, DeleteUserInput } from '@/lib';
import { INPUT_NAME, TOAST_ID } from '@/constants';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import AlertDialog from '@/components/AlertDialog';
import InputBox from '@/components/InputBox';
import FormErrorText from '@/components/FormErrorText';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

function DeleteAccount() {
	let { data: session } = useSession();
	let { addToToast } = useGlobalToastContext();
	let {
		clearErrors,
		handleSubmit,
		formState: { errors },
		register,
		setError,
	} = useForm<DeleteUserInput>({
		resolver: zodResolver(DeleteUserInputSchema),
		reValidateMode: 'onSubmit',
	});

	async function onSubmit(data: DeleteUserInput) {
		if (data.email !== session?.user.email) {
			setError(INPUT_NAME.EMAIL, { message: 'The entered email does not match the account email' });
			return;
		}

		let result = await deleteUser(data);
		if (result && 'error' in result) {
			addToToast({
				contentType: 'error',
				content: result.error,
				id: TOAST_ID.DELETE_USER,
			});
			return;
		}

		addToToast({
			contentType: 'notice',
			content: 'Success',
			id: TOAST_ID.DELETE_USER,
		});
		setAlertOpen(false);
		await logout();
	}

	let [alertOpen, setAlertOpen] = React.useState(false);
	function onAlertOpenChange(value: boolean) {
		setAlertOpen(value);
	}

	let extra = (
		<Wrapper>
			<Label htmlFor='email'>Email:</Label>
			<InputBox
				{...register(INPUT_NAME.EMAIL, {
					onChange: () => {
						clearErrors(INPUT_NAME.EMAIL);
					},
				})}
				id='email'
				style={{ '--bg-color': 'transparent' } as React.CSSProperties}
			/>
			{errors.email && <FormErrorText>{errors.email.message}</FormErrorText>}
		</Wrapper>
	);

	return (
		<AlertDialog
			description='This action cannot be undone. Your data will be deleted and can not be restored. Enter your email address to continue.'
			extra={extra}
			handleAction={handleSubmit(onSubmit)}
			openState={alertOpen}
			onOpenChange={onAlertOpenChange}
			actionDisabled={Boolean(errors.email)}
		>
			<DeleteAccountButton variant='outline'>
				<Icon id='delete' />
				&nbsp; Delete Account
			</DeleteAccountButton>
		</AlertDialog>
	);
}

export default DeleteAccount;

var Wrapper = styled.div`
	padding: 8px 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

var DeleteAccountButton = styled(Button)`
	--text-color: var(--text-status-warning);
	margin-top: auto;
`;

var Label = styled.label`
	font-size: 0.8rem;
	transform: translateX(3px);
`;
