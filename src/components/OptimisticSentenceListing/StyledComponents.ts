'use client';

import styled from 'styled-components';

export var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	isolation: isolate;
	width: 100%;
	flex: 1;
`;

export var Loading = styled.span`
	align-self: center;
	font-size: 0.8rem;
	font-weight: 350;
	color: var(--text-tertiary);
`;

export var MessageWrapper = styled.div`
	align-self: center;
	font-size: 1rem;
	color: var(--text-secondary);
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 0.9rem;
	gap: 5px;
`;
