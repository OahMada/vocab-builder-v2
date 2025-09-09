'use client';

import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';
import NavLink from '@/components/NavLink';
import { INPUT_NAME } from '@/constants';

export default function EmptyDisplay() {
	let searchParams = useSearchParams();
	let search = searchParams.get(INPUT_NAME.SEARCH);

	return (
		<>
			<Spacer size={100} />
			<MessageWrapper>
				<Text>No data available.</Text>
				{search && <Text>Try again with another search query.</Text>}
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
	font-size: ${14 / 16}rem;
`;

var MessageWrapper = styled.div`
	align-self: center;
	color: var(--text-secondary);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
`;
