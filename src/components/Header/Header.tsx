import * as React from 'react';
import Wrapper from './Wrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import StyledHeader from './StyledHeader';
import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';

function Header() {
	return (
		<Wrapper>
			<MaxWidthWrapper>
				<StyledHeader>
					<Logo />
					<MobileMenu />
				</StyledHeader>
			</MaxWidthWrapper>
		</Wrapper>
	);
}

export default Header;
