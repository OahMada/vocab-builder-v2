'use client';
import * as React from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';

import Button from '@/components/Button';
import EditUserInfo from '@/components/EditUserInfo';
import Icon from '@/components/Icon';

function UserInfo() {
	let { data: session } = useSession();
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
				<Name>{session?.user.name}</Name>
				<p>{session?.user.email}</p>
				<Button variant='outline' onClick={showModal}>
					<EditIcon id='edit' size={16} />
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

var EditIcon = styled(Icon)`
	/* optical alignment */
	position: relative;
	top: -1px;
`;
