'use client';

import Button from '@/components/Button';
import styled from 'styled-components';

export var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
	justify-content: space-between;
	color: var(--text-secondary);
`;

export var InnerWrapper = styled.div`
	padding: 12px 16px;
	border-radius: 24px;
	background-color: var(--bg-secondary);
	display: flex;
	flex-direction: column;
	gap: 3px;
`;

export var ViewAllButton = styled(Button)`
	align-self: center;
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;

export var SmallTitle = styled.h2`
	font-size: 0.6rem;
	font-weight: 600;
`;

export var Sentence = styled.p`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	/* hide text that are more than two lines */
	overflow: hidden;
`;

export var ErrorText = styled.p`
	color: var(--text-status-warning);
	font-size: 1rem;
`;
