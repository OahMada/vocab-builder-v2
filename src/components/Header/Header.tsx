import * as React from 'react';
import Wrapper from './Wrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import StyledHeader from './StyledHeader';
import Logo from '@/components/Logo';
import HeaderUser from '@/components/HeaderUser';

function Header() {
	return (
		<Wrapper>
			<MaxWidthWrapper>
				<StyledHeader>
					<Logo />
					<HeaderUser />
				</StyledHeader>
			</MaxWidthWrapper>
		</Wrapper>
	);
}

export default Header;
