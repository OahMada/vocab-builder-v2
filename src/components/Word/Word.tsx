'use client';

import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import useSWRMutation from 'swr/mutation';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';

import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import { TOAST_ID } from '@/constants';

import { MotionButton } from '@/components/Button';
import PhoneticSymbol from './PhoneticSymbol';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

type WordComponentProps = React.ComponentProps<'span'> & { piece: string; IPA: string | undefined; id: string; sentence: string };

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
	let { addIPA, removeIPA } = useSentencePiecesContext();

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
			{/* the same layoutId of WordButton and InactiveWordButton animates the position change when IPA is added */}
			{IPA ? (
				<InactiveWordButton layout='position' layoutId={`word-${piece}`}>
					{piece}
				</InactiveWordButton>
			) : (
				<WordButton variant='fill' onClick={triggerFetch} disabled={isMutating} $isMutating={isMutating} layout='position' layoutId={`word-${piece}`}>
					{piece}
				</WordButton>
			)}
			{/* can't go with popLayout mode, or the exit animation of PhoneticSymbol might teleport to elsewhere */}
			<AnimatePresence>{IPA && <PhoneticSymbol symbol={IPA} onClick={handleRemoval} layoutId={`ipa-${IPA}`} />}</AnimatePresence>
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

var WordButton = styled(MotionButton)<{ $isMutating: boolean }>`
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

var InactiveWordButton = styled(m.span)`
	font-weight: 500;
	display: block;
	padding: 3px 6px;
	border-bottom: 1px dashed var(--border);
`;

var shimmer = keyframes`
	0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;
