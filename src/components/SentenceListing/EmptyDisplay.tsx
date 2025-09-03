'use client';

import styled from 'styled-components';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';
import NavLink from '@/components/NavLink';

export default function EmptyDisplay() {
	return (
		<>
			<Spacer size={100} />
			<MessageWrapper>
				<Text>No data available.</Text>
				<InnerWrapper>
					<Icon id='forward' size={14} />
					&nbsp;
					<NavLink href='/'>Home</NavLink>
				</InnerWrapper>
			</MessageWrapper>
		</>
	);
}

var InnerWrapper = styled.div`
	display: flex;
	align-items: center;
`;

var Text = styled.p`
	font-size: 0.9rem;
`;

var MessageWrapper = styled.div`
	align-self: center;
	color: var(--text-secondary);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
`;
