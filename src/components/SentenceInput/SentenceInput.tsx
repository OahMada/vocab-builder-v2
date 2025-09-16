'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import checkSentenceUniqueness from '@/app/actions/sentence/checkSentenceUniqueness';

import { TOAST_ID, INPUT_NAME, LOCAL_STORAGE_KEY, COOKIE_KEY } from '@/constants';
import { UserInputType, UserInputSchema, setCookie } from '@/lib';
import { updateLocalStorage } from '@/helpers';
import { useReadLocalStorage } from '@/hooks';

import TextArea from '@/components/TextArea';
import Spacer from '@/components/Spacer';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import ActionButtons from './ActionButtons';

function SentenceInput() {
	let { addToToast, removeFromToast } = useGlobalToastContext();
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

	let { data: session } = useSession();

	function updateInput(text: string) {
		setValue(INPUT_NAME.SENTENCE, text);
	}

	useReadLocalStorage<string>(LOCAL_STORAGE_KEY.SENTENCE, updateInput);

	let userInput = watch(INPUT_NAME.SENTENCE);
	let { ref, ...rest } = register(INPUT_NAME.SENTENCE, {
		onChange: () => {
			clearErrors(INPUT_NAME.SENTENCE);
			removeFromToast(TOAST_ID.SENTENCE);
		},
	});

	function clearInput() {
		removeFromToast(TOAST_ID.SENTENCE);
		clearErrors(INPUT_NAME.SENTENCE);
		setValue(INPUT_NAME.SENTENCE, '');
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.SENTENCE);
	}

	async function onSubmit(data: UserInputType) {
		startTransition(async () => {
			let result = await checkSentenceUniqueness({ sentence: data[INPUT_NAME.SENTENCE], userId: session?.user?.id });
			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.SENTENCE,
				});
				return;
			} else if ('data' in result && result.data) {
				addToToast({
					contentType: 'error',
					content: 'The exact sentence is already existed in database. You should edit the existing one.',
					id: TOAST_ID.SENTENCE,
				});
				return;
			}
			setCookie(COOKIE_KEY, data[INPUT_NAME.SENTENCE]);
			updateLocalStorage('save', LOCAL_STORAGE_KEY.SENTENCE, data[INPUT_NAME.SENTENCE]);
			router.push('/sentence/new');
		});
	}

	function onError(errors: FieldErrors<UserInputType>) {
		let msg = errors[INPUT_NAME.SENTENCE]!.message as string;
		addToToast({
			contentType: 'error',
			content: msg,
			id: TOAST_ID.SENTENCE,
		});
	}

	return (
		<Wrapper onSubmit={handleSubmit(onSubmit, onError)}>
			<Spacer size={4} />
			<TextArea placeholder='Enter or paste in a sentence.' clearInput={clearInput} {...rest} ref={ref} value={userInput} />
			<ActionButtons handlePaste={updateInput} submitDisabled={!!errors[INPUT_NAME.SENTENCE] || isLoading} isLoading={isLoading} />
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
