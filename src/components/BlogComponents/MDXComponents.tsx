'use client';

import styled from 'styled-components';
import Image from 'next/image';

import { QUERIES } from '@/constants';

export var BlogP = styled.p`
	font-size: 1rem;
	margin-bottom: 1.5rem;
`;

export var BlogH2 = styled.h2`
	margin-top: 2.5rem;
	font-size: 1.5rem;
	margin-bottom: 1rem;
	font-weight: 600;
`;

export var BlogH3 = styled.h3`
	font-size: 1.2rem;
	margin-bottom: 1rem;
	font-weight: 550;
`;

export var RefundsH3 = styled(BlogH3)`
	scroll-margin-top: 4rem;
`;

export var BlogH4 = styled.h4`
	margin-bottom: 1rem;
	font-weight: 450;
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

export var BlogList = styled.li`
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;

	& > p {
		margin-bottom: 0.5rem;
	}
`;

export var Aside = styled.aside`
	border-left: 4px solid var(--border);
	padding-left: 1rem;
	font-style: italic;
	border-radius: 1px;
	color: var(--text-tertiary);
`;
export var BlogImage = styled(Image)`
	object-fit: contain;
`;
export var ImageWrapper = styled.div`
	width: 100%;
	aspect-ratio: 16/9;
	position: relative;

	@media ${QUERIES.tabletAndUp} {
		width: 70%;
	}
`;

export var ImageOuterWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	margin-bottom: 1.5rem;
`;
