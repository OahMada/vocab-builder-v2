'use client';

import styled from 'styled-components';

export var InnerWrapper = styled.div`
	padding: 20px;
	max-width: 100%;
`;

export function BlogTitle({ title, lastUpdated }: { title: string; lastUpdated?: string }) {
	return (
		<Wrapper>
			<Title>{title}</Title>
			{lastUpdated && <Date>Last Updated: {lastUpdated}</Date>}
		</Wrapper>
	);
}

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
`;

var Title = styled.h1`
	font-size: 1.5rem;
	line-height: 1;
	font-weight: 500;
	text-align: center;
`;

var Date = styled.p`
	margin-bottom: 3rem;
	color: var(--text-tertiary);
	font-style: italic;
	font-size: ${12 / 16}rem;
`;
