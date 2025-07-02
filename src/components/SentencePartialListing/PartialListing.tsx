'use client';

import * as React from 'react';
import styled from 'styled-components';

function PartialListing() {
	return (
		<Wrapper>
			<SecondaryTitle>No Content Yet</SecondaryTitle>
			<Description>The sentences you recently collected would show up here.</Description>
		</Wrapper>
	);
}

export default PartialListing;

var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-secondary);
	padding: 12px;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

var SecondaryTitle = styled.h2`
	font-size: 1rem;
	font-weight: 400;
`;

var Description = styled.p`
	font-size: 0.8rem;
	color: var(--text-tertiary);
	font-weight: 500;
`;
