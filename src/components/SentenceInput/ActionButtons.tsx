'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import { useGetClipboard } from '@/hooks';

interface ActionButtonProps {
	handlePaste: (clipboard: string) => void;
	submitDisabled: boolean;
}

function ActionButtons({ handlePaste, submitDisabled }: ActionButtonProps) {
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
				<Icon id='enter' />
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
