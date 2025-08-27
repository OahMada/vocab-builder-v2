'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserInput, UserInputSchema } from '@/lib';
import TextArea from '@/components/TextArea';
import ActionButtons from './ActionButtons';
import Spacer from '@/components/Spacer';
import Toast from '@/components/Toast';
import { setCookie, updateLocalStorage } from '@/helpers';
import { useReadLocalStorage } from '@/hooks';
import checkForSentenceUniqueness from '@/app/actions/sentence/checkSentenceUniqueness';

function SentenceInput() {
	let [isLoading, startTransition] = React.useTransition();

	// handle server action error only. this kind of error doesn't stop user from re-submitting
	let [errMsg, setErrMsg] = React.useState('');

	let router = useRouter();
	let {
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<UserInput>({
		resolver: zodResolver(UserInputSchema),
		reValidateMode: 'onSubmit',
		shouldFocusError: false,
	});

	function updateInput(text: string) {
		setValue('user-input', text);
	}

	useReadLocalStorage<string>('user-input', updateInput);

	let userInput = watch('user-input');
	let { ref, ...rest } = register('user-input', {
		onChange: () => {
			clearErrors('user-input');
		},
	});

	function clearInput() {
		setErrMsg('');
		clearErrors('user-input');
		setValue('user-input', '');
		updateLocalStorage('delete', 'user-input');
	}

	async function onSubmit(data: UserInput) {
		setErrMsg('');
		startTransition(async () => {
			let result = await checkForSentenceUniqueness(data['user-input']);
			if ('error' in result) {
				setErrMsg(result.error);
				return;
			} else if ('data' in result && result.data) {
				setErrMsg('The exact sentence is already existed in database. You should edit the existing one.');
				return;
			}
			setCookie('sentence', data['user-input']);
			updateLocalStorage('save', 'user-input', data['user-input']);
			router.push('/sentence/new');
		});
	}

	return (
		<Wrapper onSubmit={handleSubmit(onSubmit)}>
			<Spacer size={4} />
			<TextArea placeholder='Enter or paste in a sentence.' clearInput={clearInput} {...rest} ref={ref} value={userInput} />
			<ActionButtons handlePaste={updateInput} submitDisabled={!!errors['user-input'] || isLoading} isLoading={isLoading} />
			{errMsg && <Toast content={errMsg} />}
			{errors['user-input'] && <Toast content={errors['user-input'].message} />}
		</Wrapper>
	);
}

export default SentenceInput;

var Wrapper = styled.form`
	background-color: var(--bg-secondary);
	width: min(100%, 50rem);
	border-radius: 24px;
	padding: 12px;
	box-shadow: var(--shadow-elevation-low);
`;
