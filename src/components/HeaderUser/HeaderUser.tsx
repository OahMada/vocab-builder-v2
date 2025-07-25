'use client';
import * as React from 'react';
import styled from 'styled-components';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropDownMenu';
import VisuallyHidden from '@/components/VisuallyHidden';

function HeaderUser() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<UserButton variant='icon'>
					<Avatar src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80' fallbackFontSize='0.8rem' />
					<VisuallyHidden>Click to show the dropdown menu</VisuallyHidden>
				</UserButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>Account</DropdownMenuItem>
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default HeaderUser;

var UserButton = styled(Button)`
	--hover-bg-color: transparent;
	width: 35px;
	height: 35px;
	border-radius: 100%;
	padding: 0;
`;
