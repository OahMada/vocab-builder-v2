'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import useSWRMutation from 'swr/mutation';
import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import EditTranslation from '@/components/Translation/EditTranslation';
import { useTranslationTextContext } from '@/components/TranslationTextProvider';

interface TranslationResponse {
	result: string;
}

interface TranslationArg {
	sentence: string;
}

var url = '/api/translation';

function Translation({ title, sentence }: { title: React.ReactNode; sentence: string }) {
	// consume the context provider, get locally saved translation text
	let { isLocalDataLoading, updateTranslation, translation } = useTranslationTextContext();

	// when there is no local translation text or you want to fetch new translation, fetch from api route
	let { trigger, reset, isMutating, error } = useSWRMutation<TranslationResponse, Error, string, TranslationArg>(url, postFetcher);

	React.useEffect(() => {
		async function activateTrigger() {
			let data = await trigger({ sentence });
			updateTranslation(data.result);
		}
		if (!translation && !isLocalDataLoading) {
			activateTrigger();
		}
	}, [sentence, trigger, updateTranslation, translation, isLocalDataLoading]);

	async function retryTranslate() {
		reset();

		let data = await trigger({ sentence });
		if (data) {
			updateTranslation(data.result);
		}
	}

	// control the entering of editing state
	let [isEditing, setIsEditing] = React.useState(false);
	function cancelEditing() {
		setIsEditing(false);
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
						<Button variant='fill' onClick={() => setIsEditing(true)} disabled={isLocalDataLoading || isMutating}>
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
		</>
	);
}

export default React.memo(Translation);

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
