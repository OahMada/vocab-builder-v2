'use client';
import * as React from 'react';
import styled from 'styled-components';
import Modal, { Title } from '@/components/Modal';
import InputBox from '@/components/InputBox';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Spacer from '@/components/Spacer';

interface EditUserInfoProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function EditUserInfo({ isShowing, onDismiss }: EditUserInfoProps) {
	let [email, setEmail] = React.useState('');

	function clearEmail() {
		setEmail('');
	}

	function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
	}

	let [username, setUserName] = React.useState('');

	function clearUsername() {
		setUserName('');
	}

	function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setUserName(e.target.value);
	}

	return (
		<Modal isOpen={isShowing} onDismiss={onDismiss} title={<Title>Edit User Info</Title>}>
			<Wrapper>
				<Label>Name:</Label>
				<InputBox
					input={username}
					clearInput={clearUsername}
					onChange={onUsernameChange}
					id='username'
					style={{ '--bg-color': 'transparent' } as React.CSSProperties}
				/>
			</Wrapper>
			<Wrapper>
				<Label>Email:</Label>
				<InputBox
					input={email}
					clearInput={clearEmail}
					onChange={onEmailChange}
					id='email'
					style={{ '--bg-color': 'transparent' } as React.CSSProperties}
				/>
			</Wrapper>
			<Spacer size={1} />
			<Actions>
				<CancelButton variant='fill' onClick={onDismiss}>
					<Icon id='x' />
					&nbsp;Cancel
				</CancelButton>
				<SaveButton variant='fill'>
					<Icon id='save' />
					&nbsp;Save
				</SaveButton>
			</Actions>
		</Modal>
	);
}

export default EditUserInfo;

var Label = styled.label`
	font-size: 0.8rem;
`;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

var Actions = styled.div`
	display: flex;
	gap: 8px;
	align-self: flex-end;
`;

var SaveButton = styled(Button)``;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;
