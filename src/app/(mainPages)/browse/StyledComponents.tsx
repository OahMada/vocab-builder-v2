'use client';

import DescriptionText from '@/components/DescriptionText';
import styled from 'styled-components';

export var ChildrenWrapper = styled.div`
	position: sticky;
	top: 4rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: var(--bg-primary);
	box-shadow: var(--shadow-elevation-low);

	/* turn the parent flex gap into padding */
	padding-bottom: 12px;
	margin-bottom: -12px;
	z-index: 9;
`;

export var NoticeText = styled(DescriptionText)<{ $hasError?: boolean }>`
	/* optical alignment */
	margin-left: 4px;
	align-self: flex-start;
	color: ${({ $hasError }) => ($hasError ? 'var(--text-status-warning)' : 'inherit')};
`;
