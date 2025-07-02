'use client';

import * as React from 'react';
import styled from 'styled-components';

function Footer() {
	return <Wrapper>&copy; 2025-present Adam Hao. All rights reserved.</Wrapper>;
}

export default Footer;

var Wrapper = styled.div`
	display: grid;
	place-items: center;
	color: var(--text-secondary);
	font-size: 0.8rem;
`;
