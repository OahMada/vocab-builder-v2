'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Link from 'next/link';
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
					<DropdownMenuItem>
						<Account href='/account'>Account</Account>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<LogoutButton variant='icon'>Logout</LogoutButton>
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
	padding-top: 3px;
`;

var Account = styled(Link)`
	text-decoration: none;
	display: flex;
	align-items: center;
	color: inherit;
`;

var LogoutButton = styled(Button)`
	padding: 0;
	--hover-bg-color: transparent;
	&::after {
		--tap-increment: 0;
	}
`;
