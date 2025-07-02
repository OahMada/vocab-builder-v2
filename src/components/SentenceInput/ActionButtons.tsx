'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components//Icon';
import UnstyledButton from '@/components/UnstyledButton';

function ActionButtons() {
	return (
		<Wrapper>
			<Button>
				<Icon id={'clipboard'} size={18} />
				&nbsp;Paste
			</Button>
			<Button>
				<Icon id={'enter'} size={18} />
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
	gap: 12px;
`;

var Button = styled(UnstyledButton)`
	display: flex;
	align-items: center;
	border-radius: 12px;
	padding: 6px 10px;
	background-color: var(--bg-tertiary);

	@media (hover: hover) {
		&:hover {
			background-color: var(--bg-tertiary-hover);
		}
	}
`;
