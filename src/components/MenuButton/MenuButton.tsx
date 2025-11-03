'use client';

import * as React from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';

import logout from '@/app/actions/auth/logout';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, MobileDropdownMenuItem } from '@/components/DropDownMenu';
import Avatar from '@/components/Avatar';
import Loading from '@/components/Loading';

function MenuButton() {
	let [isLoading, startTransition] = React.useTransition();

	function handleLogout() {
		startTransition(async () => {
			await logout();
		});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<MenuIcon variant='icon'>
					<Icon id='mobile-menu' />
					<VisuallyHidden>Click to expand the menu</VisuallyHidden>
				</MenuIcon>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<React.Suspense fallback={<AvatarLoadingFallback />}>
					<ErrorBoundary fallback={<ErrorItem disabled={true}>Error</ErrorItem>}>
						<AvatarWrapper>
							<Avatar style={{ '--avatar-size': '35px', '--fallback-font-size': '14px' } as React.CSSProperties} fallbackStyle='outline' />
						</AvatarWrapper>
					</ErrorBoundary>
				</React.Suspense>
				<MobileDropdownMenuItem asChild={true}>
					<DropdownItemButton variant='icon' href='/account' disabled={isLoading}>
						Account
					</DropdownItemButton>
				</MobileDropdownMenuItem>
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
	);
}

export default MenuButton;

var MenuIcon = styled(Button)`
	--hover-bg-color: var(--bg-secondary);
`;

var AvatarWrapper = styled.div`
	border-radius: 100%;
	margin-left: auto;
	margin-bottom: 5px;
	position: relative;
	margin-right: 5px;
`;

var DropdownItemButton = styled(Button)`
	--hover-bg-color: transparent;
	&::after {
		--tap-increment: 0;
	}
`;

var LogoutButton = styled(DropdownItemButton)`
	color: var(--text-status-warning);
`;

var AvatarLoadingFallback = styled(AvatarWrapper)`
	width: 35px;
	height: 35px;
	background-color: var(--bg-tertiary);
	border: 1px solid var(--border);
`;

var ErrorItem = styled(DropdownMenuItem)`
	color: var(--text-status-warning);
`;
