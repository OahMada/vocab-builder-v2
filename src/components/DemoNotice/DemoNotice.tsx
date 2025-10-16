'use client';

import * as React from 'react';
import styled from 'styled-components';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';

function DemoNotice() {
	let [showNotice, setShowNotice] = React.useState(true);
	return (
		showNotice && (
			<Wrapper>
				<CloseButton variant='icon' onClick={() => setShowNotice(false)}>
					<Icon id='close' />
					<VisuallyHidden>close notice</VisuallyHidden>
				</CloseButton>
				<NoticeText>In this demo app, no real API calls will be made, and database access is read-only.</NoticeText>
			</Wrapper>
		)
	);
}

export default DemoNotice;

var Wrapper = styled.div`
	position: fixed;
	top: 5rem;
	border-radius: 12px;
	border: 1px solid var(--border);
	padding: 12px;
	background-color: var(--bg-secondary);
	display: flex;
	gap: 5px;
	align-items: center;
	margin-left: 16px;
	margin-right: 16px;
`;

var NoticeText = styled.p``;

var CloseButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
