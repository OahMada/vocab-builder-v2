'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';

import checkSentenceUniqueness from '@/app/actions/sentence/checkSentenceUniqueness';

import { TOAST_ID, INPUT_NAME, COOKIE_KEY } from '@/constants';
import { UserInputType, UserInputSchema, setCookie } from '@/lib';
import { handleError, updateLocalStorage } from '@/utils';
import { useReadLocalStorage, usePaste } from '@/hooks';

import TextArea from '@/components/TextArea';
import Spacer from '@/components/Spacer';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import ActionButtons from './ActionButtons';
import { ErrorText, ErrorTitle } from '@/components/ErrorDisplay';

function SentenceInput() {
	let { data: session, update: updateSession } = useSession();
	let userId = session?.user?.id;
	let { addToToast, removeFromToast } = useGlobalToastContext();
	let [isLoading, startTransition] = React.useTransition();
	let textareaRef = React.useRef<null | HTMLTextAreaElement>(null);

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
	let userInput = watch(INPUT_NAME.SENTENCE);

	let updateInput = React.useCallback(
		function (text: string) {
			setValue(INPUT_NAME.SENTENCE, text);
		},
		[setValue]
	);

	function clearInputError() {
		clearErrors(INPUT_NAME.SENTENCE);
	}

	// paste text directly on home page
	usePaste((text: string) => {
		clearInputError(); // reset
		if (document.activeElement === textareaRef.current) {
			// only concatenate existing text when the element is focused
			updateInput(userInput + text);
		} else {
			updateInput(text);
			textareaRef.current?.focus();
		}
	});
	useReadLocalStorage(updateInput);

	let { ref, ...rest } = register(INPUT_NAME.SENTENCE, {
		onChange: () => {
			clearInputError();
			removeFromToast(TOAST_ID.SENTENCE);
		},
	});
	React.useImperativeHandle(ref, () => textareaRef.current);

	function clearInput() {
		removeFromToast(TOAST_ID.SENTENCE);
		clearInputError();
		setValue(INPUT_NAME.SENTENCE, '');
		updateLocalStorage('delete');
	}

	async function onSubmit(data: UserInputType) {
		startTransition(async () => {
			let currentSession = await updateSession();
			if (!currentSession) {
				router.replace('/auth/login');
			}

			let result = await checkSentenceUniqueness({ sentence: data[INPUT_NAME.SENTENCE], userId });

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
			updateLocalStorage('save', data[INPUT_NAME.SENTENCE]);
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

	let submitHandler = handleSubmit(onSubmit, onError);

	return (
		<Wrapper onSubmit={submitHandler}>
			<Spacer size={4} />
			<TextArea
				placeholder='Input or paste in a sentence'
				clearInput={clearInput}
				{...rest}
				ref={textareaRef}
				value={userInput}
				keydownSubmit={submitHandler}
			/>
			<ActionButtons
				handlePaste={updateInput}
				submitDisabled={!!errors[INPUT_NAME.SENTENCE] || isLoading}
				isLoading={isLoading}
				clearInputError={clearInputError}
			/>
		</Wrapper>
	);
}

function Fallback({ error }: FallbackProps) {
	let errorMsg = handleError(error);
	return (
		<ErrorWrapper>
			<ErrorTitle>An Error Occurred</ErrorTitle>
			<ErrorText>{errorMsg}</ErrorText>
		</ErrorWrapper>
	);
}

var SentenceInputWithErrorBoundary = withErrorBoundary(SentenceInput, {
	FallbackComponent: Fallback,
});

export default SentenceInputWithErrorBoundary;

var Wrapper = styled.form`
	background-color: var(--bg-secondary);
	width: min(100%, 40rem);
	border-radius: 24px;
	padding: 12px;
	box-shadow: var(--shadow-elevation-low);
`;

var ErrorWrapper = styled(Wrapper)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`;
