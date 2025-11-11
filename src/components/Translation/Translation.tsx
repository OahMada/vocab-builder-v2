'use client';

import * as React from 'react';
import styled from 'styled-components';
import useSWRMutation from 'swr/mutation';

import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import { CUSTOM_SPRING, TOAST_ID } from '@/constants';

import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import EditTranslation from '@/components/Translation/EditTranslation';
import { useTranslationContext } from '@/components/TranslationProvider';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import CardWrapper from '@/components/CardWrapper';

interface TranslationResponse {
	data: string;
}

interface TranslationArg {
	sentence: string;
}

var url = '/api/translation';

function Translation({ title, sentence }: { title: React.ReactNode; sentence: string }) {
	let { addToToast, removeFromToast } = useGlobalToastContext();

	// consume the context provider, get locally saved translation text
	let { updateTranslation, translation, isEditing, updateEditingStatus } = useTranslationContext();

	// when there is no local translation text or you want to fetch new translation, fetch from api route
	let { trigger, reset, isMutating, error } = useSWRMutation<TranslationResponse, Error, string, TranslationArg>(url, postFetcher, {
		onError: (err) => {
			/* to show the retry errors */
			if (translation) {
				addToToast({
					id: TOAST_ID.TRANSLATION_FETCHING,
					contentType: 'error',
					content: handleError(err),
				});
			}
		},
	});

	React.useEffect(() => {
		async function activateTrigger() {
			let result = await trigger({ sentence });
			if (result) {
				updateTranslation(result.data);
			}
		}

		// loading data when
		// - page first loads
		// - there have been an error, then the user tried to edit translation, but canceled their action, thus, there is still no translation to show

		if (sentence && !translation && !isEditing) {
			activateTrigger();
		}
	}, [sentence, trigger, updateTranslation, translation, isEditing]);

	async function retryTranslate() {
		reset();
		removeFromToast(TOAST_ID.TRANSLATION_FETCHING);
		let result = await trigger({ sentence });
		if (result) {
			updateTranslation(result.data);
		}
	}

	async function cancelEditing() {
		updateEditingStatus(false);
	}

	function startEditing() {
		// reset error so it would not reappear after editing.
		reset();
		updateEditingStatus(true);
	}

	// display translation text
	let translationEle: React.ReactNode;
	if (translation) {
		translationEle = translation;
	} else if (isMutating) {
		translationEle = <LoadingText>Loading...</LoadingText>;
	} else if (error) {
		translationEle = <ErrorText>{handleError(error)}</ErrorText>;
	}

	return (
		<CardWrapper layout={true} transition={CUSTOM_SPRING}>
			{title}
			{isEditing ? (
				<EditTranslation translationText={translation ? translation : ''} cancelEditing={cancelEditing} />
			) : (
				<>
					<TranslationText $isLoading={isMutating}>{translationEle}</TranslationText>
					<ButtonWrapper>
						<Button variant='fill' onClick={startEditing} disabled={isMutating}>
							<EditIcon id='edit' size={16} />
							&nbsp;Edit
						</Button>
						<Button variant='fill' onClick={retryTranslate} disabled={isMutating}>
							{translation && isMutating ? <Loading description='retrying translation' /> : <Icon id='retry' size={16} />}
							&nbsp;Retry
						</Button>
					</ButtonWrapper>
				</>
			)}
		</CardWrapper>
	);
}

export default Translation;

var TranslationText = styled.p<{ $isLoading: boolean }>`
	opacity: ${({ $isLoading }) => ($isLoading ? 0.75 : 1)};
`;
var ButtonWrapper = styled.span`
	align-self: flex-end;
	display: flex;
	gap: 5px;
`;

var LoadingText = styled.span`
	color: var(--text-tertiary);
	transform: translateX(3px);
	display: inline-block;
	margin-right: 15px;
`;
var ErrorText = styled.span`
	color: var(--text-status-warning);
`;

var EditIcon = styled(Icon)`
	/* optical alignment */
	transform: translateY(-0.5px);
`;
