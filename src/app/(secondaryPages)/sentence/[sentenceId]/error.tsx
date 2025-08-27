'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import styled from 'styled-components';
import Button from '@/components/Button';
import Spacer from '@/components/Spacer';
import Icon from '@/components/Icon';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<ErrorTitle>An Error occurred.</ErrorTitle>
				<ErrorText>{error.message}</ErrorText>
				<Spacer size={12} />
				<Button variant='outline' onClick={() => reset()}>
					<Icon id='retry' />
					&nbsp; Try again
				</Button>
			</Wrapper>
		</MaxWidthWrapper>
	);
}

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
`;

var ErrorTitle = styled.h2`
	font-weight: 500;
	font-size: 1rem;
	color: var(--text-status-warning);
`;

var ErrorText = styled.p`
	color: var(--text-status-warning);
	font-size: 0.8rem;
	opacity: 0.8;
`;
