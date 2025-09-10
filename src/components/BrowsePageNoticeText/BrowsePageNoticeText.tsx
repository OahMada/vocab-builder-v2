'use client';

import styled, { css } from 'styled-components';
import DescriptionText from '@/components/DescriptionText';

var NoticeText = styled(DescriptionText)<{ $hasError?: boolean }>`
	/* optical alignment */
	margin-left: 4px;
	align-self: flex-start;
	${({ $hasError }) => {
		if ($hasError)
			return css`
				color: var(--text-status-warning);
			`;
	}}
`;

export default NoticeText;
