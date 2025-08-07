'use client';

import * as React from 'react';
import styled from 'styled-components';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Button from '@/components/Button';

function TextareaActionButtons({
	handleCancel,
	handleSubmit,
}: {
	handleCancel: () => void;
	handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}) {
	return (
		<Wrapper>
			<CancelButton variant='outline' onClick={handleCancel}>
				<Icon id='x' />
				<VisuallyHidden>Cancel</VisuallyHidden>
			</CancelButton>
			<AcceptButton variant='outline' onClick={handleSubmit}>
				<Icon id='accept' />
				<VisuallyHidden>Accept</VisuallyHidden>
			</AcceptButton>
		</Wrapper>
	);
}

export default TextareaActionButtons;

var Wrapper = styled.div`
	display: flex;
	gap: 8px;
	justify-content: flex-end;
`;

var AcceptButton = styled(Button)`
	padding: 6px;
	--hover-bg-color: var(--bg-tertiary);
`;

var CancelButton = styled(AcceptButton)`
	--text-color: var(--text-status-warning);
`;
