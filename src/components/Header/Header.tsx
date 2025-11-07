import * as React from 'react';

import { auth } from '@/auth';
import { Theme } from '@/types';
import getCookie from '@/lib/getCookie';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Logo from '@/components/Logo';
import MenuButton from '@/components/MenuButton';
import { Wrapper, StyledHeader, LoginButton, InnerWrapper } from './StyledComponents';
import ThemeToggle from '@/components/ThemeToggle';
import HeaderNav from './HeaderNav';

async function Header() {
	let session = await auth();

	let savedTheme = await getCookie('color-theme');
	let theme = savedTheme || 'dark';

	return (
		<Wrapper>
			<MaxWidthWrapper>
				<StyledHeader>
					<Logo />
					<HeaderNav />
					<InnerWrapper>
						<ThemeToggle initialTheme={theme as Theme} />
						{!!session?.user ? (
							<MenuButton />
						) : (
							<LoginButton variant='fill' href='/auth/login'>
								Log in
							</LoginButton>
						)}
					</InnerWrapper>
				</StyledHeader>
			</MaxWidthWrapper>
		</Wrapper>
	);
}

export default Header;
