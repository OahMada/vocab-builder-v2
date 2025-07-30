'use client';
import Button from '@/components/Button';
import EditUserInfo from '@/components/EditUserInfo';
import Icon from '@/components/Icon';
import * as React from 'react';
import styled from 'styled-components';

function UserInfo() {
	let [isShowing, setIsShowing] = React.useState(false);

	function dismissModal() {
		setIsShowing(false);
	}

	function showModal() {
		setIsShowing(true);
	}

	return (
		<>
			<Wrapper>
				<Name>Adam Hao</Name>
				<p>haozg44@gmail.com</p>
				<Button variant='outline' onClick={showModal}>
					<Icon id='edit' size={16} />
					&nbsp;Edit Info
				</Button>
			</Wrapper>
			{isShowing && <EditUserInfo isShowing={isShowing} onDismiss={dismissModal} />}
		</>
	);
}

export default UserInfo;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	align-items: center;
`;

var Name = styled.h2`
	line-height: 1;
	font-weight: 450;
	font-size: 1.2rem;
`;
