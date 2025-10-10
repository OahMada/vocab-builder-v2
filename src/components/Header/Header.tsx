import * as React from 'react';

import { auth } from '@/auth';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';
import { Wrapper, StyledHeader, LoginButton, HeaderNav } from './StyledComponents';
import NavLink from '@/components/NavLink';

async function Header() {
	let session = await auth();
	return (
		<Wrapper>
			<MaxWidthWrapper>
				<StyledHeader>
					<Logo />
					<HeaderNav>
						<NavLink href='/browse'>Browse</NavLink>
						<NavLink href='account'>Account</NavLink>
						<NavLink href='/sync' prefetch={true}>
							How to Sync
						</NavLink>
					</HeaderNav>
					{!!session?.user ? (
						<MobileMenu />
					) : (
						<LoginButton variant='fill' href='/auth/login'>
							Log in
						</LoginButton>
					)}
				</StyledHeader>
			</MaxWidthWrapper>
		</Wrapper>
	);
}

export default Header;
