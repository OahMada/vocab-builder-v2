'use client';

import * as React from 'react';
import styled from 'styled-components';

function Logo() {
	return (
		<Wrapper>
			<VSpan>V</VSpan>
			<BSpan>B</BSpan>
		</Wrapper>
	);
}

export default Logo;

var Wrapper = styled.span`
	font-size: 1.5rem;
	display: flex;
	font-family: var(--font-logo);
	font-weight: 400;
	font-style: normal;
`;

var VSpan = styled.span`
	display: block;
	transform: translateY(-3.5px);
`;

var BSpan = styled.span`
	display: block;
	transform: translate(-3px, 1.5px);
`;
