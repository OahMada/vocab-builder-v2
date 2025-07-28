'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import VisuallyHidden from '@/components/VisuallyHidden';
import Link from 'next/link';
import { LogOut } from 'react-feather';

function MobileMenu() {
	let [isOpen, setIsOpen] = React.useState(false);
	function dismissModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}
	return (
		<>
			<Wrapper>
				<Button variant='icon' onClick={openModal}>
					<Icon id='mobile-menu' />
				</Button>
			</Wrapper>
			{isOpen && (
				<Modal isOpen={isOpen} onDismiss={dismissModal} title={<VisuallyHidden>Mobile Menu</VisuallyHidden>} contentPosition='full-screen'>
					<Nav>
						<Account href='/account'>
							<Icon id='account' size={20}></Icon>&nbsp;Account
						</Account>
						<LogoutButton variant='icon'>
							<Icon id='log-out' size={19} />
							&nbsp; Logout
						</LogoutButton>
					</Nav>
				</Modal>
			)}
		</>
	);
}

export default MobileMenu;

var Wrapper = styled.div`
	margin-left: auto;
`;

var Account = styled(Link)`
	text-decoration: none;
	display: flex;
	align-items: center;
	color: inherit;
`;

var Nav = styled.nav`
	padding: 30px;
	font-size: 1.5rem;
	font-weight: 300;
	display: flex;
	flex-direction: column;
	gap: 30px;
	align-items: center;
`;

var LogoutButton = styled(Button)`
	padding: 0;
	--hover-bg-color: transparent;
`;
