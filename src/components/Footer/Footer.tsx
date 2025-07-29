'use client';

import * as React from 'react';
import styled from 'styled-components';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';

function Footer() {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<p>&copy; 2025-present Adam Hao. All rights reserved.</p>
				<FooterNav>
					<NavLink href='/intro'>Intro</NavLink> &middot; <NavLink href='/'>Home</NavLink> &middot; <NavLink href='/about'>About</NavLink>
				</FooterNav>
			</Wrapper>
		</MaxWidthWrapper>
	);
}

export default Footer;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: var(--text-tertiary);
	font-size: 0.8rem;
	height: 100%;
`;

var FooterNav = styled.nav``;

var NavLink = styled(Link)`
	color: var(--text-secondary);
	font-size: 0.8rem;

	text-decoration: none;

	@media (hover: hover) {
		&:hover {
			text-decoration: revert;
		}
	}
`;
