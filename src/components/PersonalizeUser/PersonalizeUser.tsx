'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import updateUser from '@/app/actions/user/updateUser';

import { PersonalizeInputSchema, PersonalizeInput } from '@/lib';
import { USER_UPDATE_ACTION } from '@/constants';

import ChooseLanguage from '@/components/ChooseLanguage';
import ChooseIPAFlavour from '@/components/ChooseIPAFlavour';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';

// reference https://stackoverflow.com/questions/68103612/how-to-drop-the-query-parameters-after-a-redirect-with-nextjs?rq=2

export default function PersonalizeUser({ hasName }: { hasName: boolean }) {
	let { data: session, update: updateSession } = useSession();
	let { addToToast } = useGlobalToastContext();
	let router = useRouter();
	let [isLoading, startTransition] = React.useTransition();
	let {
		watch,
		control,
		register,
		clearErrors,
		formState: { errors },
		handleSubmit,
	} = useForm<PersonalizeInput>({
		resolver: zodResolver(PersonalizeInputSchema),
		reValidateMode: 'onSubmit',
		defaultValues: {
			learningLanguage: 'English',
			EnglishIPAFlavour: 'UK',
			nativeLanguage: 'Chinese',
		},
		shouldUnregister: true,
	});

	let learningLanguage = watch('learningLanguage');

	function onSubmit(data: PersonalizeInput) {
		startTransition(async () => {
			let result = await updateUser({
				...data,
				userId: session?.user.id,
				action: USER_UPDATE_ACTION.PERSONALIZE,
			});

			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: 'user_update',
				});
				return;
			}
			await updateSession(result.data);
			addToToast({
				id: 'user_update',
				contentType: 'notice',
				content: 'User Updated',
			});
			router.replace('/');
		});
	}

	return (
		<Wrapper>
			<Title>Before you start...</Title>
			<InnerWrapper>
				{!hasName && (
					<NameInputWrapper>
						<Label htmlFor='name'>Name:</Label>
						<InputBox
							id='name'
							placeholder='John Doe'
							{...register('name', {
								onChange: () => {
									clearErrors('name');
								},
							})}
						/>
						{errors.name && <ErrorText>{errors.name.message}</ErrorText>}
					</NameInputWrapper>
				)}
				<Controller
					render={({ field }) => {
						let { onChange, ...rest } = field;
						return <ChooseLanguage type='learning' {...rest} onValueChange={onChange} defaultValue={field.value} />;
					}}
					control={control}
					name='learningLanguage'
				/>

				<Controller
					render={({ field }) => {
						let { onChange, ...rest } = field;
						return <ChooseLanguage type='translation' {...rest} onValueChange={onChange} defaultValue={field.value} />;
					}}
					control={control}
					name='nativeLanguage'
				/>
				{learningLanguage === 'English' && (
					<Controller
						render={({ field }) => {
							let { onChange, ...rest } = field;
							return <ChooseIPAFlavour {...rest} onValueChange={onChange} defaultValue={field.value || 'UK'} />;
						}}
						control={control}
						name='EnglishIPAFlavour'
					/>
				)}
			</InnerWrapper>
			<SubmitButton variant='outline' onClick={handleSubmit(onSubmit)} disabled={isLoading}>
				{isLoading ? <Loading description='updating user' /> : <Icon id='enter' />}
				&nbsp; Submit
			</SubmitButton>
		</Wrapper>
	);
}

var Wrapper = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 20px;
`;

var Title = styled.h2`
	font-size: ${24 / 16}rem;
	font-weight: 600;
	text-align: center;
`;

var InnerWrapper = styled.div`
	width: 100%;
	border-radius: 24px;
	background-color: var(--bg-secondary);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	padding: 12px;
	box-shadow: var(--shadow-elevation-low);
`;

var NameInputWrapper = styled.div`
	width: min(100%, 350px);
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding: 0 10px;
`;

var Label = styled.label`
	align-self: flex-start;
	transform: translateX(5px);
	font-size: ${14 / 16}rem;
	font-weight: 500;
`;

var SubmitButton = styled(Button)`
	margin-top: 10px;
	align-self: center;
`;

var ErrorText = styled.span`
	transform: translateX(5px);
	color: var(--text-status-warning);
	font-size: ${12 / 16}rem;
`;
