'use client';

import * as React from 'react';
import styled from 'styled-components';

import { useGetClipboard } from '@/hooks';

import Icon from '@/components/Icon';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

interface ActionButtonProps {
	handlePaste: (clipboard: string) => void;
	submitDisabled: boolean;
	isLoading: boolean;
}

function ActionButtons({ handlePaste, submitDisabled, isLoading }: ActionButtonProps) {
	let [isClipboardDisabled, getClipboard] = useGetClipboard();
	async function handleClickPaste() {
		if (getClipboard.current) {
			let text = await getClipboard.current();
			handlePaste(text);
		}
	}

	return (
		<Wrapper>
			<Button variant='fill' disabled={isClipboardDisabled} onClick={handleClickPaste} type='button'>
				<Icon id='clipboard' />
				&nbsp;Paste
			</Button>
			<Button variant='fill' type='submit' disabled={submitDisabled}>
				{isLoading ? <Loading description='submitting sentence' /> : <Icon id='enter' />}
				&nbsp;Enter
			</Button>
		</Wrapper>
	);
}

export default ActionButtons;

var Wrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 12px;
	gap: 8px;
`;
