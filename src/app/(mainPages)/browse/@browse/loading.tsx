'use client';

import * as React from 'react';
import styled from 'styled-components';
import Spinner from '@/components/Loading';

export default function Loading() {
	return (
		<Wrapper>
			<CornerSpinner description='Loading sentence list' />
		</Wrapper>
	);
}

var Wrapper = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	background-color: var(--bg-secondary);
	border-radius: 12px;
`;

var CornerSpinner = styled(Spinner)`
	position: absolute;
	right: 16px;
	bottom: 16px;
`;
