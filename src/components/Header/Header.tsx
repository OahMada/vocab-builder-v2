import * as React from 'react';

import { auth } from '@/auth';

import { Wrapper, StyledHeader, LoginButton } from './StyledComponents';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';

async function Header() {
	let session = await auth();
	return (
		<Wrapper>
			<MaxWidthWrapper>
				<StyledHeader>
					<Logo />
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
