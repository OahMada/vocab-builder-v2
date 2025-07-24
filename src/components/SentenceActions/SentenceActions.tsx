'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import AskAQuestion from '@/components/AskAQuestion';

function SentenceActions() {
	let [isShowing, setIsShowing] = React.useState(false);

	function dismissModal() {
		setIsShowing(false);
	}

	function showModal() {
		setIsShowing(true);
	}

	return (
		<>
			<Wrapper>
				<HelpButton variant='outline' onClick={showModal}>
					<Icon id='help' />
					<VisuallyHidden>Ask Any Questions</VisuallyHidden>
				</HelpButton>
				<AudioButton variant='outline'>
					<Icon id='audio' />
					<VisuallyHidden>Play sentence audio</VisuallyHidden>
				</AudioButton>
				<CancelButton variant='outline'>
					<Icon id='x' />
					&nbsp;Cancel
				</CancelButton>
				<DoneButton variant='outline'>
					<Icon id='enter' />
					&nbsp;Done
				</DoneButton>
			</Wrapper>
			{isShowing && <AskAQuestion isShowing={isShowing} onDismiss={dismissModal} />}
		</>
	);
}

export default SentenceActions;

var Wrapper = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;
	justify-content: flex-end;
	margin-top: auto;
`;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;

var HelpButton = styled(Button)``;

var DoneButton = styled(Button)``;

var AudioButton = styled(Button)``;
