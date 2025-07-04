'use client';

import * as React from 'react';
import styled from 'styled-components';
import UnstyledButton from '@/components/UnstyledButton';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';

function AcceptButton() {
	return (
		<Wrapper>
			<Icon id='accept' size={18} />
			<VisuallyHidden>Accept</VisuallyHidden>
		</Wrapper>
	);
}

export default AcceptButton;

var Wrapper = styled(UnstyledButton)`
	padding: 6px;
	border-radius: 12px;
	border: 1px solid var(--border-medium);
	@media (hover: hover) {
		&:hover {
			background-color: var(--bg-tertiary);
		}
	}
`;
