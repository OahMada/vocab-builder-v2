'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import AskAQuestion from '@/components/AskAQuestion';

function SentenceActions() {
	let [isShowing, setIsShowing] = React.useState(false);

	function dismissDrawer() {
		setIsShowing(false);
	}

	function showDrawer() {
		setIsShowing(true);
	}

	return (
		<>
			<Wrapper>
				<HelpButton variant='outline' onClick={showDrawer}>
					<Icon id='help' />
					<VisuallyHidden>Ask Any Questions</VisuallyHidden>
				</HelpButton>
				<CancelButton variant='outline'>
					<Icon id='x' />
					&nbsp;Cancel
				</CancelButton>
				<DoneButton variant='outline'>
					<Icon id='enter' />
					&nbsp;Done
				</DoneButton>
			</Wrapper>
			{isShowing && <AskAQuestion isShowing={isShowing} onDismiss={dismissDrawer} />}
		</>
	);
}

export default SentenceActions;

var Wrapper = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;
	justify-content: flex-end;
`;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;

var HelpButton = styled(Button)`
	margin-right: auto;
`;

var DoneButton = styled(Button)``;
