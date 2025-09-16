'use client';

import styled from 'styled-components';

export var MessageWrapper = styled.div`
	text-align: center;
`;

export var Title = styled.h2`
	font-weight: 700;
	font-size: ${18 / 16}rem;
	color: var(--text-status-warning);
`;

export var InnerWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export var ErrorCode = styled.code`
	background-color: var(--bg-secondary);
	padding: 4px;
	border-radius: 4px;
`;

export var SecondaryText = styled.p`
	color: var(--text-tertiary);
`;
