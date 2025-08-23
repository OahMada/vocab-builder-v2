'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserInput, UserInputSchema } from '@/lib';
import Textarea from '@/components/Textarea/Textarea';
import ActionButtons from './ActionButtons';
import Spacer from '@/components/Spacer';
import Toast from '@/components/Toast';
import { setCookie, updateLocalStorage } from '@/helpers';
import { useReadLocalStorage } from '@/hooks';

function SentenceInput() {
	let router = useRouter();
	let {
		watch,
		setValue,
		register,
		handleSubmit,
		clearErrors,
		formState: { errors },
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
		clearErrors('user-input');
		setValue('user-input', '');
		updateLocalStorage('delete', 'user-input');
	}

	function onSubmit(data: UserInput) {
		// TODO check if sentence already exists
		setCookie('user-input', data['user-input']);
		updateLocalStorage('save', 'user-input', data['user-input']);
		router.push('/sentence/new');
	}

	return (
		<Wrapper onSubmit={handleSubmit(onSubmit)}>
			<Spacer size={4} />
			<Textarea placeholder='Enter or paste in a sentence.' clearInput={clearInput} {...rest} ref={ref} value={userInput} />
			<ActionButtons handlePaste={updateInput} submitDisabled={!!errors['user-input']} />
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
