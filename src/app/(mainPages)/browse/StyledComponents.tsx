'use client';

import styled from 'styled-components';
import DescriptionText from '@/components/DescriptionText';

export var InnerWrapper = styled.div`
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

export var NoticeText = styled(DescriptionText)`
	/* optical alignment */
	margin-left: 4px;
	align-self: flex-start;
`;
