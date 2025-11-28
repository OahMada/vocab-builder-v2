'use client';
import * as React from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/Button';
import EditUserInfo from '@/components/EditUserInfo';
import Icon from '@/components/Icon';
import { handleError } from '@/utils';
import { ErrorText, ErrorTitle } from '@/components/ErrorDisplay';

function UserInfo({ name, email }: { name: string; email: string }) {
	let [isShowing, setIsShowing] = React.useState(false);
	let { data: session } = useSession();

	function dismissModal() {
		setIsShowing(false);
	}

	function showModal() {
		setIsShowing(true);
	}

	return (
		<>
			<Wrapper>
				<Name>{session?.user.name ? session.user.name : name}</Name>
				<p>{session?.user.email ? session.user.email : email}</p>
				<Button variant='outline' onClick={showModal}>
					<EditIcon id='edit' size={15} />
					&nbsp;Edit Info
				</Button>
			</Wrapper>
			{isShowing && <EditUserInfo isShowing={isShowing} onDismiss={dismissModal} />}
		</>
	);
}

var UserInfoWithErrorBoundary = withErrorBoundary(UserInfo, {
	FallbackComponent: Fallback,
});

export default UserInfoWithErrorBoundary;

function Fallback({ error }: FallbackProps) {
	let errorMsg = handleError(error);
	return (
		<ErrorWrapper>
			<ErrorTitle>An Error Occurred</ErrorTitle>
			<ErrorText>{errorMsg}</ErrorText>
		</ErrorWrapper>
	);
}

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

var ErrorWrapper = styled.div`
	text-align: center;
`;
