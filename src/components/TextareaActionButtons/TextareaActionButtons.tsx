'use client';

import * as React from 'react';
import styled from 'styled-components';
import { m } from 'motion/react';

import { CUSTOM_SPRING } from '@/constants';

import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';

function TextareaActionButtons({
	handleCancel,
	handleSubmit,
	submitDisabled,
}: {
	handleCancel: () => void;
	handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
	submitDisabled: boolean;
}) {
	return (
		<Wrapper layout={true} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={CUSTOM_SPRING}>
			<CancelButton variant='outline' onClick={handleCancel}>
				<Icon id='x' />
				<VisuallyHidden>Cancel</VisuallyHidden>
			</CancelButton>
			<AcceptButton variant='outline' onClick={handleSubmit} disabled={submitDisabled}>
				<Icon id='accept' />
				<VisuallyHidden>Accept</VisuallyHidden>
			</AcceptButton>
		</Wrapper>
	);
}

export default TextareaActionButtons;

var Wrapper = styled(m.div)`
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
