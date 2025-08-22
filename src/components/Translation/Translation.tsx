'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import useSWRMutation from 'swr/mutation';
import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import EditTranslation from '@/components/Translation/EditTranslation';
import { useTranslationContext } from '@/components/TranslationProvider';
import Toast from '@/components/Toast';

interface TranslationResponse {
	result: string;
}

var url = '/api/translation';

function Translation({ title, sentence }: { title: React.ReactNode; sentence: string }) {
	// consume the context provider, get locally saved translation text
	let { isLocalDataLoading, updateTranslation, translation } = useTranslationContext();

	// when there is no local translation text or you want to fetch new translation, fetch from api route
	let { trigger, reset, isMutating, error } = useSWRMutation<TranslationResponse, Error, string, void>(url, postFetcher);

	// control the entering of editing state
	let [isEditing, setIsEditing] = React.useState(false);

	React.useEffect(() => {
		async function activateTrigger() {
			let data = await trigger();
			if (data) {
				updateTranslation(data.result);
			}
		}

		// loading data when
		// - page first loads
		// - there have been an error, then the user tried to edit translation, but canceled their action, thus, there is still no translation to show
		if (!translation && !isLocalDataLoading && !isEditing) {
			activateTrigger();
		}
	}, [sentence, trigger, updateTranslation, translation, isLocalDataLoading, isEditing]);

	async function retryTranslate() {
		reset();

		let data = await trigger();
		if (data) {
			updateTranslation(data.result);
		}
	}

	async function cancelEditing() {
		setIsEditing(false);
	}

	function startEditing() {
		// reset error so it would not reappear after editing.
		reset();
		setIsEditing(true);
	}

	// display translation text
	let translationEle: React.ReactNode;
	if (translation) {
		translationEle = translation;
	} else if (isMutating || isLocalDataLoading) {
		translationEle = <LoadingText>Loading...</LoadingText>;
	} else if (error) {
		translationEle = <ErrorText>{handleError(error)}</ErrorText>;
	}

	return (
		<>
			{title}
			{isEditing ? (
				<EditTranslation translationText={translation ? translation : ''} cancelEditing={cancelEditing} />
			) : (
				<>
					<TranslationText $isLoading={isMutating}>{translationEle}</TranslationText>
					<ButtonWrapper>
						<Button variant='fill' onClick={startEditing} disabled={isLocalDataLoading || isMutating}>
							<EditIcon id='edit' size={16} />
							&nbsp;Edit
						</Button>
						<Button variant='fill' onClick={retryTranslate} disabled={isLocalDataLoading || isMutating}>
							<Icon id='retry' size={16} />
							&nbsp;Retry
						</Button>
					</ButtonWrapper>
				</>
			)}
			{/* to show the retry errors */}
			{translation && error && <Toast content={handleError(error)} />}
		</>
	);
}

export default Translation;

var TranslationText = styled.p<{ $isLoading: boolean }>`
	opacity: ${({ $isLoading }) => ($isLoading ? 0.6 : 1)};
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
