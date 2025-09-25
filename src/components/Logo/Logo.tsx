'use client';

import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

function Logo() {
	return (
		<Wrapper href='/'>
			<span>VOCAB</span>
			<span>BUILDER</span>
		</Wrapper>
	);
}

export default Logo;

var Wrapper = styled(Link)`
	text-decoration: none;
	font-size: 10px;
	font-weight: 600;
	line-height: 1;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-family: var(--font-logo);
	color: inherit;
`;
