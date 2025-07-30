'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropDownMenu';
import Avatar from '@/components/Avatar';

function MobileMenu() {
	return (
		<Wrapper>
			<DropdownMenu>
				<DropdownMenuTrigger asChild={true}>
					<Button variant='icon'>
						<Icon id='mobile-menu' />
						<VisuallyHidden>Click to expand the menu</VisuallyHidden>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<AvatarWrapper>
						<Avatar
							src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'
							style={{ '--avatar-size': '35px', '--fallback-font-size': '14px' } as React.CSSProperties}
							fallbackStyle='outline'
						/>
					</AvatarWrapper>
					<DropdownMenuItem asChild={true}>
						<DropdownItemButton variant='icon' href='/account'>
							Account
						</DropdownItemButton>
					</DropdownMenuItem>
					<DropdownMenuItem asChild={true}>
						<DropdownItemButton variant='icon'>Logout</DropdownItemButton>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</Wrapper>
	);
}

export default MobileMenu;

var Wrapper = styled.div`
	margin-left: auto;
`;

var AvatarWrapper = styled.div`
	border-radius: 100%;
	margin-left: auto;
`;

var DropdownItemButton = styled(Button)`
	--hover-bg-color: transparent;
	&::after {
		--tap-increment: 0;
	}
`;
