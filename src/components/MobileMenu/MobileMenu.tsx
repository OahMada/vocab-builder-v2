'use client';

import * as React from 'react';
import styled from 'styled-components';

import logout from '@/app/actions/auth/logout';

import { QUERIES } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropDownMenu';
import Avatar from '@/components/Avatar';
import Loading from '@/components/Loading';

function MobileMenu() {
	let [isLoading, startTransition] = React.useTransition();

	function handleLogout() {
		startTransition(async () => {
			await logout();
		});
	}

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
						<Avatar style={{ '--avatar-size': '35px', '--fallback-font-size': '14px' } as React.CSSProperties} fallbackStyle='outline' />
					</AvatarWrapper>
					<DropdownMenuItem asChild={true}>
						<AccountDropdownItemButton variant='icon' href='/account' disabled={isLoading}>
							Account
						</AccountDropdownItemButton>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild={true}
						onSelect={(event) => {
							// Prevent Radix from automatically closing the menu
							event.preventDefault();
						}}
					>
						<LogoutButton variant='icon' onClick={handleLogout} disabled={isLoading}>
							{isLoading && (
								<>
									<Loading description='Logging out' size={16} />
									&nbsp;
								</>
							)}
							Log Out
						</LogoutButton>
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
	margin-bottom: 5px;
`;

var DropdownItemButton = styled(Button)`
	--hover-bg-color: transparent;
	&::after {
		--tap-increment: 0;
	}
`;

var AccountDropdownItemButton = styled(DropdownItemButton)`
	@media ${QUERIES.laptopAndUp} {
		display: none;
	}
`;

var LogoutButton = styled(DropdownItemButton)`
	color: var(--text-status-warning);
`;
