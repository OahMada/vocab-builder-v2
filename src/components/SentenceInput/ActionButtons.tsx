'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import Button from '@/components/Button';

function ActionButtons() {
	return (
		<Wrapper>
			<Button variant='fill'>
				<Icon id={'clipboard'} size={18} />
				&nbsp;Paste
			</Button>
			<Button variant='fill'>
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
