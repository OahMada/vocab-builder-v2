'use client';

import * as React from 'react';
import styled from 'styled-components';
import DescriptionText from '@/components/DescriptionText';

function PartialListing() {
	return (
		<Wrapper>
			<SecondaryTitle>No Content Yet</SecondaryTitle>
			<DescriptionText>The sentences you recently collected would show up here.</DescriptionText>
		</Wrapper>
	);
}

export default PartialListing;

var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-secondary);
	padding: 12px;
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

var SecondaryTitle = styled.h3`
	font-size: 1rem;
	font-weight: 400;
`;
