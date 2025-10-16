import * as React from 'react';

import { auth } from '@/auth';
import { Theme } from '@/types';
import getCookie from '@/lib/getCookie';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';
import { Wrapper, StyledHeader, HeaderNav, InnerWrapper } from './StyledComponents';
import NavLink from '@/components/NavLink';
import ThemeToggle from '@/components/ThemeToggle';
import DemoLoginButton from '@/components/DemoLoginButton';

async function Header() {
	let session = await auth();

	let savedTheme = await getCookie('color-theme');
	let theme = savedTheme || 'dark';

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
					<InnerWrapper>
						<ThemeToggle initialTheme={theme as Theme} />
						{!!session?.user ? <MobileMenu /> : <DemoLoginButton />}
					</InnerWrapper>
				</StyledHeader>
			</MaxWidthWrapper>
		</Wrapper>
	);
}

export default Header;
