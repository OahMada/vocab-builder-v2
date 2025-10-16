'use client';

import Button from '@/components/Button';
import * as React from 'react';
import styled from 'styled-components';

import demoLogin from '@/app/actions/auth/demoLogin';

function DemoLoginButton() {
	let [isLoading, startTransition] = React.useTransition();

	function loginAsDemo() {
		startTransition(async () => {
			await demoLogin();
		});
	}

	return (
		<LoginButton variant='fill' disabled={isLoading} onClick={loginAsDemo}>
			Log in
		</LoginButton>
	);
}

export default DemoLoginButton;

export var LoginButton = styled(Button)`
	--bg-color: var(--bg-revert);
	--hover-bg-color: var(--bg-revert-hover);
	--text-color: var(--text-revert);
	border-radius: 24px;
	font-size: ${14 / 16}rem;
	font-weight: 500;
`;
