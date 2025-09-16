'use client';

import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import useSWRMutation from 'swr/mutation';
import Button from '@/components/Button';
import PhoneticSymbol from './PhoneticSymbol';
import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID } from '@/constants';

type WordComponentProps = React.ComponentProps<'span'> & { piece: string; IPA?: string | null; id: string; sentence: string };

interface IPAResponse {
	data: string;
}
interface IPAArg {
	word: string;
	sentence: string;
}

var url = '/api/IPA';

function Word({ piece, IPA, id, sentence }: WordComponentProps) {
	let { addToToast, removeFromToast } = useGlobalToastContext();

	let { trigger, reset, isMutating } = useSWRMutation<IPAResponse, Error, string, IPAArg>(url, postFetcher, {
		onError: (err) => {
			addToToast({
				id: `${TOAST_ID.IPA_FETCHING}${piece}`,
				contentType: 'error',
				content: handleError(err),
			});
		},
	});
	let { addIPA, removeIPA, isLocalDataLoading } = useSentencePiecesContext();

	if (piece === ' ') {
		return undefined;
	}

	async function triggerFetch() {
		removeFromToast(`${TOAST_ID.IPA_FETCHING}${piece}`);
		let result = await trigger({ word: piece, sentence });
		if (result) {
			addIPA({ text: piece, IPA: result.data, id });
		}
	}

	function handleRemoval() {
		reset();
		removeIPA({ word: piece, id });
	}

	return (
		<Wrapper>
			{IPA ? (
				<InactiveWordButton>{piece}</InactiveWordButton>
			) : (
				<WordButton variant='fill' onClick={triggerFetch} disabled={isMutating || isLocalDataLoading} $isMutating={isMutating}>
					{piece}
				</WordButton>
			)}
			{IPA && <PhoneticSymbol symbol={IPA} onClick={handleRemoval} />}
		</Wrapper>
	);
}

export default Word;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3px;
`;

var WordButton = styled(Button)<{ $isMutating: boolean }>`
	padding: 3px 6px;
	border-radius: 8px;
	font-weight: 500;

	${({ $isMutating }) =>
		$isMutating &&
		css`
			background-image: var(--loading-background-image);
			background-size: 200% 100%;
			background-repeat: no-repeat;
			animation: ${shimmer} 800ms ease-in-out infinite alternate;
		`}
`;

var InactiveWordButton = styled.span`
	font-weight: 500;
	display: block;
	padding: 4px;
	border-bottom: 1px dashed var(--border-medium);
`;

var shimmer = keyframes`
	0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;
