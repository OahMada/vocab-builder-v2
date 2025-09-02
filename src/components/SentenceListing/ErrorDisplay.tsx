'use client';

import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';
import { useRouter } from 'next/navigation';

export default function ErrorDisplay() {
	let router = useRouter();

	function refreshPage() {
		router.refresh();
	}

	return (
		<>
			<Spacer size={100} />
			<MessageWrapper>
				<ErrorMessage>Failed to load sentences.</ErrorMessage>
				<RefreshButton variant='outline' onClick={refreshPage}>
					<Icon id='retry' size={14} />
					&nbsp;Refresh
				</RefreshButton>
			</MessageWrapper>
		</>
	);
}

var ErrorMessage = styled.p`
	color: var(--text-status-warning);
	font-size: ${14 / 16}rem;
`;

var RefreshButton = styled(Button)`
	color: inherit;
	vertical-align: -2.5px;
`;

var MessageWrapper = styled.div`
	align-self: center;
	color: var(--text-secondary);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
`;
