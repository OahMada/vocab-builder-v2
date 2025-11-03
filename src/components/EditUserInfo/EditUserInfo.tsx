'use client';
import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import updateUser from '@/app/actions/user/updateUser';

import { UserInfoInputSchema, UserInfoInput } from '@/lib';
import { TOAST_ID, USER_UPDATE_ACTION } from '@/constants';

import Modal from '@/components/Modal';
import InputBox from '@/components/InputBox';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';
import FormErrorText from '@/components/FormErrorText';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';
import BottomRightSpinner from '@/components/BottomRightSpinner';

interface EditUserInfoProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function EditUserInfo({ isShowing, onDismiss }: EditUserInfoProps) {
	let { data: session, update: updateSession } = useSession();
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();
	let {
		register,
		formState: { errors },
		clearErrors,
		handleSubmit,
	} = useForm<UserInfoInput>({
		resolver: zodResolver(UserInfoInputSchema),
		reValidateMode: 'onSubmit',
		values: {
			name: session?.user.name || '',
			email: session?.user.email || '',
		},
	});

	function onSubmit(data: UserInfoInput) {
		startTransition(async () => {
			let result = await updateUser({
				...data,
				userId: session?.user.id,
				action: USER_UPDATE_ACTION.USER_INFO,
			});

			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.USER_UPDATE,
				});
				return;
			}
			addToToast({
				id: TOAST_ID.USER_UPDATE,
				contentType: 'notice',
				content: 'Account Updated',
			});
			await updateSession(result.data);
			onDismiss();
		});
	}

	return (
		<React.Suspense fallback={<BottomRightSpinner description='loading modal component' />}>
			<Modal isOpen={isShowing} onDismiss={onDismiss} heading={<Title>Edit User Info</Title>}>
				<Wrapper>
					<Label>Name:</Label>
					<InputBox
						id='username'
						style={{ '--bg-color': 'transparent' } as React.CSSProperties}
						{...register('name', {
							onChange: () => {
								clearErrors('name');
							},
						})}
						placeholder='John Doe'
					/>
					{errors.name && <FormErrorText>{errors.name.message}</FormErrorText>}
				</Wrapper>
				<Wrapper>
					<Label>Email:</Label>
					<InputBox
						id='email'
						style={{ '--bg-color': 'transparent' } as React.CSSProperties}
						{...register('email', {
							onChange: () => {
								clearErrors('email');
							},
						})}
						placeholder='example@email.com'
					/>
					{errors.email && <FormErrorText>{errors.email.message}</FormErrorText>}
				</Wrapper>
				<Spacer size={1} />
				<Actions>
					<CancelButton variant='fill' onClick={onDismiss}>
						<Icon id='x' />
						&nbsp;Cancel
					</CancelButton>
					<SaveButton variant='fill' onClick={handleSubmit(onSubmit)} disabled={isLoading}>
						{isLoading ? <Loading description='updating user' /> : <Icon id='save' />}
						&nbsp;Save
					</SaveButton>
				</Actions>
			</Modal>
		</React.Suspense>
	);
}

export default EditUserInfo;

var Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 450;
	line-height: 1;
`;

var Label = styled.label`
	font-size: 0.8rem;
	transform: translateX(3px);
`;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

var Actions = styled.div`
	display: flex;
	gap: 8px;
	align-self: flex-end;
`;

var SaveButton = styled(Button)``;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;
