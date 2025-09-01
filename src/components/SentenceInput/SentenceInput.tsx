'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserInputType, UserInputSchema } from '@/lib';
import TextArea from '@/components/TextArea';
import ActionButtons from './ActionButtons';
import Spacer from '@/components/Spacer';
import { setCookie, updateLocalStorage } from '@/helpers';
import { useReadLocalStorage } from '@/hooks';
import checkForSentenceUniqueness from '@/app/actions/sentence/checkSentenceUniqueness';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

function SentenceInput() {
	let { addToToast, resetToast } = useGlobalToastContext();
	let [isLoading, startTransition] = React.useTransition();

	let router = useRouter();
	let {
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<UserInputType>({
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
			resetToast('sentence');
		},
	});

	function clearInput() {
		resetToast('sentence');
		clearErrors('user-input');
		setValue('user-input', '');
		updateLocalStorage('delete', 'user-input');
	}

	async function onSubmit(data: UserInputType) {
		resetToast('sentence');
		startTransition(async () => {
			let result = await checkForSentenceUniqueness(data['user-input']);
			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: 'sentence',
				});
				return;
			} else if ('data' in result && result.data) {
				addToToast({
					contentType: 'error',
					content: 'The exact sentence is already existed in database. You should edit the existing one.',
					id: 'sentence',
				});
				return;
			}
			setCookie('sentence', data['user-input']);
			updateLocalStorage('save', 'user-input', data['user-input']);
			router.push('/sentence/new');
		});
	}

	function onError(errors: FieldErrors<UserInputType>) {
		let msg = errors['user-input']!.message as string;
		addToToast({
			contentType: 'error',
			content: msg,
			id: 'sentence',
		});
	}

	return (
		<Wrapper onSubmit={handleSubmit(onSubmit, onError)}>
			<Spacer size={4} />
			<TextArea placeholder='Enter or paste in a sentence.' clearInput={clearInput} {...rest} ref={ref} value={userInput} />
			<ActionButtons handlePaste={updateInput} submitDisabled={!!errors['user-input'] || isLoading} isLoading={isLoading} />
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
