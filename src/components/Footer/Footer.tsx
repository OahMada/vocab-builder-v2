'use client';

import * as React from 'react';
import styled from 'styled-components';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import NavLink from '@/components/NavLink';

function Footer() {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<p>&copy; 2025-present Adam Hao. All rights reserved.</p>
				<FooterNav>
					<Link href='/intro'>Intro</Link> &middot; <Link href='/'>Home</Link> &middot; <Link href='/about'>About</Link>
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

var Link = styled(NavLink)`
	color: var(--text-secondary);
	font-size: 0.8rem;
`;
