'use client';

import styled from 'styled-components';
import * as React from 'react';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Spacer from '@/components/Spacer';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';

function ErrorDisplay({ errorMsg, handleReset }: { errorMsg: string; handleReset: () => void }) {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<ErrorTitle>An Error Occurred</ErrorTitle>
				<ErrorText>{errorMsg}</ErrorText>
				<ErrorText>Please contact support if the error persists.</ErrorText>
				<Spacer size={12} />
				<Button variant='outline' onClick={handleReset}>
					<Icon id='refresh' />
					&nbsp; Try again
				</Button>
			</Wrapper>
		</MaxWidthWrapper>
	);
}

export default ErrorDisplay;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
`;

export var ErrorTitle = styled.h2`
	font-weight: 500;
	font-size: 1rem;
	color: var(--text-status-warning);
`;

export var ErrorText = styled.p`
	color: var(--text-status-warning);
	font-size: 0.8rem;
	opacity: 0.8;
`;
