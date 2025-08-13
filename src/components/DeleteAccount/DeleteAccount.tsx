'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/AlertDialog';
import InputBox from '@/components/InputBox';

function DeleteAccount() {
	let [email, setEmail] = React.useState('');

	function clearEmail() {
		setEmail('');
	}

	function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild={true}>
				<DeleteAccountButton variant='outline'>
					<Icon id='delete' />
					&nbsp; Delete Account
				</DeleteAccountButton>
			</AlertDialogTrigger>
			<AlertDialogContent description='This action cannot be undone. Your data will be deleted and can not be restored. Enter your email address to continue.'>
				<Wrapper>
					<Label htmlFor='email'>Email:</Label>
					<InputBox
						input={email}
						clearInput={clearEmail}
						onChange={onEmailChange}
						id='email'
						style={{ '--bg-color': 'transparent' } as React.CSSProperties}
					/>
				</Wrapper>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteAccount;

var Wrapper = styled.div`
	padding: 8px 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

var DeleteAccountButton = styled(Button)`
	--text-color: var(--text-status-warning);
	margin-top: auto;
	margin-bottom: 16px;
`;

var Label = styled.label`
	font-size: 0.8rem;
`;
