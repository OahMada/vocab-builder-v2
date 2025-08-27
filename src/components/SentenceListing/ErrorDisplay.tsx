'use client';

import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';
import { useRouter } from 'next/navigation';
import { MessageWrapper } from './StyledComponents';

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
				<InnerWrapper>
					<RefreshButton variant='outline' onClick={refreshPage}>
						<Icon id='retry' size={14} />
						&nbsp;Refresh
					</RefreshButton>
				</InnerWrapper>
			</MessageWrapper>
		</>
	);
}

var ErrorMessage = styled.p`
	color: var(--text-status-warning);
	font-size: 0.9rem;
`;

var InnerWrapper = styled.p``;

var RefreshButton = styled(Button)`
	color: inherit;
	vertical-align: -2.5px;
`;
