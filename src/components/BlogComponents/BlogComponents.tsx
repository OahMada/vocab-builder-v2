'use client';

import styled from 'styled-components';

import Image from 'next/image';

export var BlogP = styled.p`
	font-size: 1rem;
	margin-bottom: 1.5rem;
`;

export var InnerWrapper = styled.div`
	padding: 20px;
	width: 100%;
`;

export var InlineCode = styled.code`
	background-color: var(--bg-secondary);
	font-size: 0.95em;
	padding: 3px 6px;
	border-radius: 4px;
`;

export var CodeBlock = styled.pre`
	padding: 1rem;
	border-radius: 8px;
	margin-bottom: 1.5rem;
	background-color: var(--bg-secondary);

	overflow: auto;

	& code {
		background: none;
		padding: 0;
	}
`;

export var OrderedList = styled.ol`
	margin-bottom: 1.5rem;
	padding-left: 1.5rem;
`;
export var UnorderedList = styled.ul`
	margin-bottom: 1.5rem;
	padding-left: 1.5rem;
`;

export var Aside = styled.aside`
	border-left: 4px solid var(--bg-tertiary);
	padding-left: 1rem;
	font-style: italic;
	border-radius: 0.25rem;
	color: var(--text-tertiary);
`;

export var BlogImage = styled(Image)`
	width: 100%;
	object-fit: contain;
`;

export var ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 16/9;
`;

export var ImageOuterWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	margin-bottom: 1.5rem;
`;

export var SmallTitle = styled.h2`
	font-size: ${18 / 16}rem;
	line-height: 1;
	margin-bottom: 0.5rem;
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
