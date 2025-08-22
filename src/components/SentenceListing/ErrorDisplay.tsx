'use client';

import styled from 'styled-components';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
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
					Try refresh page&nbsp;
					<RefreshButton variant='icon' onClick={refreshPage}>
						<Icon id='retry' size={14} />
						<VisuallyHidden>refresh page</VisuallyHidden>
					</RefreshButton>
				</InnerWrapper>
			</MessageWrapper>
		</>
	);
}

var ErrorMessage = styled.p`
	color: var(--text-status-warning);
`;

var InnerWrapper = styled.p`
	font-size: 0.8rem;
`;

var RefreshButton = styled(Button)`
	color: inherit;
	display: inline-block;
	vertical-align: -2.5px;
`;
