'use client';

import Button from '@/components/Button';
import styled from 'styled-components';

export var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	padding: 10px 16px;
	display: flex;
	gap: 5px;
	position: absolute;
	bottom: 0;
	color: var(--text-secondary);
	width: 100%;
	justify-content: space-between;
	border-radius: 12px;
`;

export var InnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
`;

export var ViewAllButton = styled(Button)`
	font-size: 14px;
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
	line-height: 1;
`;

export var Sentence = styled.p`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	/* hide text that are more than two lines */
	overflow: hidden;
	font-size: 0.8rem;
	line-height: 1.3;
`;

export var ErrorText = styled.p`
	color: var(--text-status-warning);
	font-size: 0.8rem;
`;
