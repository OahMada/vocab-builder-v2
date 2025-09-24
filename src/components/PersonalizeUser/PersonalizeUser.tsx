'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm, Controller, FieldValues, Path, UseControllerReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDebouncer } from '@tanstack/react-pacer';

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
import FormErrorText from '@/components/FormErrorText';

// reference https://stackoverflow.com/questions/68103612/how-to-drop-the-query-parameters-after-a-redirect-with-nextjs?rq=2

var defaultFormValues = {
	learningLanguage: 'English',
	EnglishIPAFlavour: 'UK',
	nativeLanguage: 'Chinese',
	name: '',
} as const;

interface PersonalizeUserProps {
	showSubmitButton: boolean;
	hasName: boolean;
}

type RHFOnChange = UseControllerReturn<FieldValues, Path<FieldValues>>['field']['onChange'];

export default function PersonalizeUser({ showSubmitButton, hasName }: PersonalizeUserProps) {
	let { data: session, update: updateSession } = useSession();
	let { addToToast } = useGlobalToastContext();
	let router = useRouter();
	let [isLoading, startTransition] = React.useTransition();
	let {
		setValue,
		watch,
		control,
		register,
		clearErrors,
		formState: { errors },
		handleSubmit,
	} = useForm<PersonalizeInput>({
		resolver: zodResolver(PersonalizeInputSchema),
		reValidateMode: 'onSubmit',
		defaultValues: defaultFormValues,
		shouldUnregister: true,
	});
	let learningLanguage = watch('learningLanguage');

	// robustly display the session data
	React.useEffect(() => {
		if (!session?.user) return;
		let { learningLanguage, nativeLanguage, EnglishIPAFlavour } = session.user;
		if (learningLanguage) {
			setValue('learningLanguage', learningLanguage);
		}
		if (nativeLanguage) {
			setValue('nativeLanguage', nativeLanguage);
		}
		if (EnglishIPAFlavour) {
			setValue('EnglishIPAFlavour', EnglishIPAFlavour);
		}
	}, [session?.user, setValue]);

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
				content: 'Account Updated',
			});
			if (showSubmitButton) {
				router.replace('/');
			}
		});
	}

	// handle language setting update on account page
	let debouncer = useDebouncer(handleSubmit(onSubmit), { wait: 2000 });

	function handleChange(fn: RHFOnChange) {
		return (value: string) => {
			fn(value);
			if (!showSubmitButton) {
				debouncer.cancel(); // so that the waiting time is consistent
				debouncer.maybeExecute();
			}
		};
	}

	return (
		<>
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
							disabled={isLoading}
						/>
						{errors.name && <FormErrorText>{errors.name.message}</FormErrorText>}
					</NameInputWrapper>
				)}
				<Controller
					render={({ field }) => {
						let { onChange, ...rest } = field;
						return <ChooseLanguage type='learning' {...rest} onValueChange={handleChange(onChange)} defaultValue={field.value} />;
					}}
					control={control}
					name='learningLanguage'
					disabled={isLoading}
				/>

				<Controller
					render={({ field }) => {
						let { onChange, ...rest } = field;
						return <ChooseLanguage type='translation' {...rest} onValueChange={handleChange(onChange)} defaultValue={field.value} />;
					}}
					control={control}
					name='nativeLanguage'
					disabled={isLoading}
				/>
				{learningLanguage === 'English' && (
					<Controller
						render={({ field }) => {
							let { onChange, ...rest } = field;
							return <ChooseIPAFlavour {...rest} onValueChange={handleChange(onChange)} defaultValue={field.value || 'UK'} />;
						}}
						control={control}
						name='EnglishIPAFlavour'
						disabled={isLoading}
					/>
				)}
			</InnerWrapper>
			{showSubmitButton && (
				<SubmitButton variant='outline' onClick={handleSubmit(onSubmit)} disabled={isLoading}>
					{isLoading ? <Loading description='updating user' /> : <Icon id='enter' />}
					&nbsp; Submit
				</SubmitButton>
			)}
		</>
	);
}

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
