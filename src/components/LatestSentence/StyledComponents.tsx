'use client';

import Button from '@/components/Button';
import styled from 'styled-components';

export var ViewAllButton = styled(Button)`
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;

export var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	width: min(100%, 40rem);
`;

export var InnerWrapper = styled.div`
	background-color: var(--bg-secondary);
	padding: 12px 14px;
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	font-size: ${14 / 16}rem;
	color: var(--text-secondary);
	gap: 3px;
`;

export var SmallTitle = styled.h2`
	font-size: 1rem;
	font-weight: 450;
	color: var(--text-primary);
`;

export var ErrorText = styled.p`
	color: var(--text-status-warning);
	font-size: 14px;
`;
