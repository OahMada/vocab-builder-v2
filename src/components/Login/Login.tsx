'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import login from '@/app/actions/auth/login';

import { LoginInputSchema, LoginInputType } from '@/lib';
import { INPUT_NAME } from '@/constants';

import InputBox from '@/components/InputBox';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Loading from '@/components/Loading';
import { TOAST_ID } from '@/constants';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

function Login() {
	let [emailSent, setEmailSent] = React.useState(false);
	let [isLoading, startTransition] = React.useTransition();
	let router = useRouter();
	let { addToToast } = useGlobalToastContext();

	function RetryEmailLogin() {
		setEmailSent(false);
	}

	let {
		setValue,
		register,
		handleSubmit,
		clearErrors,
		formState: { errors },
	} = useForm<LoginInputType>({
		resolver: zodResolver(LoginInputSchema),
		reValidateMode: 'onSubmit',
	});

	// let email = watch(INPUT_NAME.EMAIL);

	function clearInput() {
		clearErrors(INPUT_NAME.EMAIL);
		setValue(INPUT_NAME.EMAIL, '');
	}

	function onSubmit(data: LoginInputType) {
		startTransition(async () => {
			let result = await login(data);

			if ('error' in result) {
				addToToast({
					id: TOAST_ID.LOGIN,
					contentType: 'error',
					content: result.error,
				});
			} else if ('data' in result) {
				let parsed = new URL(result.data);
				if (parsed.searchParams.get('error')) {
					router.push(result.data);
				} else {
					setEmailSent(true);
				}
			}
		});
	}

	return (
		<Wrapper>
			{emailSent ? (
				<>
					<SmallTitle>Check your email</SmallTitle>
					<p>
						A “magic link” has been emailed to you, containing a link you can click to log in. It should show up in your inbox within 30 seconds or
						so.
					</p>
					<p>
						The subject line will be <ItalicText>“Your login link”</ItalicText>.
					</p>
					<SecondaryText>
						You can
						<TryAgainButton variant='icon' onClick={RetryEmailLogin}>
							Try again
						</TryAgainButton>
						if you don&apos;t see anything after 2 minutes.
					</SecondaryText>
				</>
			) : (
				<>
					<Title>Log In</Title>
					<InputWrapper>
						<LabelText htmlFor='email'>Enter your email:</LabelText>
						<InputBox
							type='email'
							placeholder='Email'
							id='email'
							clearInput={clearInput}
							defaultValue=''
							{...register(INPUT_NAME.EMAIL, {
								onChange: () => {
									clearErrors(INPUT_NAME.EMAIL);
								},
							})}
						/>
						{errors.email && <ErrorText>{errors.email.message}</ErrorText>}
					</InputWrapper>
					<EmailButton variant='fill' onClick={handleSubmit(onSubmit)} disabled={isLoading}>
						{isLoading ? <Loading description='Signing in' /> : <Icon id='enter' />}
						&nbsp; Continue
					</EmailButton>
					<Divider>
						<HorizontalLine />
						<span>Or</span>
						<HorizontalLine />
					</Divider>
					<GoogleButton variant='fill'>
						<Icon id='globe' />
						&nbsp; Continue With Google
					</GoogleButton>
				</>
			)}
		</Wrapper>
	);
}

export default Login;

var SmallTitle = styled.h3`
	font-weight: 700;
	font-size: ${18 / 16}rem;
`;

var SecondaryText = styled.p`
	color: var(--text-tertiary);
`;

var ItalicText = styled.span`
	font-style: italic;
`;

var TryAgainButton = styled(Button)`
	display: inline-block;
	text-decoration: underline;
	--text-color: var(--text-tertiary);
`;

var Wrapper = styled.div`
	width: min(100%, 500px);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	text-align: center;
`;

var InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

var LabelText = styled.label`
	transform: translateX(5px);
	font-size: ${14 / 16}rem;
	font-weight: 500;
	color: var(--text-tertiary);
	text-align: left;
`;

var ErrorText = styled.span`
	transform: translateX(5px);
	color: var(--text-status-warning);
	font-size: ${12 / 16}rem;
	text-align: left;
`;

var EmailButton = styled(Button)`
	align-self: center;
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-secondary-hover);
`;

var Divider = styled.div`
	align-items: center;
	display: flex;
	gap: 16px;
	color: var(--text-tertiary);
	padding: 0 16px;
`;

var HorizontalLine = styled.div`
	border-top: 1px solid var(--bg-tertiary);
	flex: 1;
`;

var GoogleButton = styled(Button)`
	align-self: center;
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-secondary-hover);
`;

var Title = styled.h2`
	font-size: ${24 / 16}rem;
	font-weight: 600;
	margin-bottom: 10px;
`;
