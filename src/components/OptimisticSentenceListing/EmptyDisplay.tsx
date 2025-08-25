'use client';

import styled from 'styled-components';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';
import { MessageWrapper } from './StyledComponents';
import NavLink from '@/components/NavLink';

export default function EmptyDisplay() {
	return (
		<>
			<Spacer size={100} />
			<MessageWrapper>
				<p>No data available.</p>
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
	font-size: 0.8rem;
`;
