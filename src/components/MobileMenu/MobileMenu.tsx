'use client';

import * as React from 'react';
import styled from 'styled-components';

import logout from '@/app/actions/auth/logout';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropDownMenu';
import Avatar from '@/components/Avatar';
import Loading from '@/components/Loading';

function MobileMenu() {
	let [isLoading, startTransition] = React.useTransition();
	let [isMenuOpen, setIsMenuOpen] = React.useState(false);

	function onOpenChange(open: boolean) {
		if (!isLoading) {
			setIsMenuOpen(open);
		}
	}

	function handleLogout() {
		startTransition(async () => {
			await logout();
			setIsMenuOpen(false);
		});
	}

	return (
		<Wrapper>
			<DropdownMenu open={isMenuOpen} onOpenChange={onOpenChange}>
				<DropdownMenuTrigger asChild={true}>
					<Button variant='icon'>
						<Icon id='mobile-menu' />
						<VisuallyHidden>Click to expand the menu</VisuallyHidden>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<AvatarWrapper>
						<Avatar style={{ '--avatar-size': '35px', '--fallback-font-size': '14px' } as React.CSSProperties} fallbackStyle='outline' />
					</AvatarWrapper>
					<DropdownMenuItem asChild={true}>
						<DropdownItemButton variant='icon' href='/account'>
							Account
						</DropdownItemButton>
					</DropdownMenuItem>
					<DropdownMenuItem asChild={true}>
						<DropdownItemButton variant='icon' onClick={handleLogout} disabled={isLoading}>
							{isLoading && (
								<>
									<Loading description='Logging out' />
									&nbsp;
								</>
							)}
							Logout
						</DropdownItemButton>
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
