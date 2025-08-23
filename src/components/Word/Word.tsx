'use client';

import * as React from 'react';
import styled from 'styled-components';
import useSWRMutation from 'swr/mutation';
import Button from '@/components/Button';
import PhoneticSymbol from './PhoneticSymbol';
import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import Toast from '@/components/Toast';
import Loading from '@/components/Loading';
import { useWordsContext } from '@/components/WordsProvider';

type WordComponentProps = React.ComponentProps<'span'> & { piece: string; IPA: string | undefined | null; id: string };

interface IPAResponse {
	result: string;
}
interface IPAArg {
	word: string;
}

var url = '/api/IPA';

function Word({ piece, IPA, id }: WordComponentProps) {
	let { trigger, error, reset, isMutating } = useSWRMutation<IPAResponse, Error, string, IPAArg>(url, postFetcher);
	let { addIPA, removeIPA, isLocalDataLoading } = useWordsContext();

	if (piece === ' ') {
		return undefined;
	}

	async function triggerFetch() {
		let data = await trigger({ word: piece });
		if (data) {
			addIPA({ text: piece, IPA: data.result, id });
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
				<WordButton variant='fill' onClick={triggerFetch} disabled={isMutating || isLocalDataLoading}>
					{isMutating ? (
						<>
							{piece}&nbsp;
							<Loading description={`load IPA for word ${piece} `} size={14} />
						</>
					) : (
						piece
					)}
				</WordButton>
			)}
			{IPA && <PhoneticSymbol symbol={IPA} onClick={handleRemoval} />}
			{error && <Toast content={handleError(error)} />}
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

var WordButton = styled(Button)`
	padding: 3px 6px;
	border-radius: 8px;
	font-weight: 500;
`;

var InactiveWordButton = styled.span`
	font-weight: 500;
	display: block;
	padding: 4px;
	border-bottom: 1px dashed var(--border-medium);
`;
