'use client';

import * as React from 'react';
import styled from 'styled-components';
import useSWRMutation from 'swr/mutation';
import Button from '@/components/Button';
import PhoneticSymbol from './PhoneticSymbol';
import { postFetcher } from '@/lib';
import { handleError } from '@/utils';
import Toast from '@/components/Toast';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Loading from '@/components/Loading';

type WordProps = React.ComponentProps<'span'> & { segment: string; isWord: boolean };

interface IPAResponse {
	result: string;
}

interface IPAArg {
	word: string;
}

var url = '/api/IPA';

function Word({ segment, isWord }: WordProps) {
	let { trigger, data, error, reset, isMutating } = useSWRMutation<IPAResponse, Error, string, IPAArg>(url, postFetcher);

	if (segment === ' ') {
		return undefined;
	}

	async function triggerFetch() {
		await trigger({ word: segment });
	}

	return isWord ? (
		<Wrapper>
			{data ? (
				<InactiveWordButton>{segment}</InactiveWordButton>
			) : (
				<WordButton variant='fill' onClick={triggerFetch} disabled={isMutating}>
					{isMutating ? (
						<>
							{segment}&nbsp;
							<Loading description={`load IPA for word ${segment} `} size={14} />
						</>
					) : (
						segment
					)}
				</WordButton>
			)}
			{data && <PhoneticSymbol symbol={data.result} onClick={reset} />}
			{error && <Toast content={handleError(error)} />}
		</Wrapper>
	) : (
		segment
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
