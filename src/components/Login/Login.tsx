'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import emailLogin from '@/app/actions/auth/emailLogin';
import googleLogin from '@/app/actions/auth/googleLogin';

import { LoginInputSchema, LoginInputType } from '@/lib';
import { INPUT_NAME } from '@/constants';

import InputBox from '@/components/InputBox';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Loading from '@/components/Loading';
import { TOAST_ID } from '@/constants';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

function Login({ error }: { error: string | undefined }) {
	let [emailSent, setEmailSent] = React.useState(false);
	let [emailLoggingLoading, setEmailLoggingLoading] = React.useState(false);
	let [oauthLoggingLoading, startTransition] = React.useTransition();
	let router = useRouter();
	let searchParams = useSearchParams();
	let callback = searchParams.get('callback');

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

	function clearInput() {
		clearErrors(INPUT_NAME.EMAIL);
		setValue(INPUT_NAME.EMAIL, '');
	}

	function onSubmit(data: LoginInputType) {
		setEmailLoggingLoading(true);
		React.startTransition(async () => {
			let result = await emailLogin({ email: data.email, callback: callback ?? undefined });

			if ('error' in result) {
				addToToast({
					id: TOAST_ID.LOGIN,
					contentType: 'error',
					content: result.error,
				});
			} else if ('data' in result && result.data) {
				let parsed = new URL(result.data);
				if (parsed.searchParams.get('error')) {
					router.push(result.data);
				} else {
					setEmailSent(true);
				}
			}
			setEmailLoggingLoading(false);
		});
	}

	function handleGoogleLogin() {
		startTransition(async () => {
			let result = await googleLogin(callback ?? undefined);
			if (result && 'error' in result) {
				addToToast({
					id: TOAST_ID.LOGIN,
					contentType: 'error',
					content: result.error,
				});
			}
		});
	}

	let errorMsgEle: React.ReactNode;

	if (error) {
		if (error === ErrorCodes.OAuthAccountNotLinked) {
			errorMsgEle = <ErrorMsg>{ErrorMap[ErrorCodes.OAuthAccountNotLinked] + ` Code: ${error}`}</ErrorMsg>;
		} else {
			errorMsgEle = <ErrorMsg>{ErrorMap[ErrorCodes.Default] + ` Code: ${error}`}</ErrorMsg>;
		}
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
					<EmailButton variant='fill' onClick={handleSubmit(onSubmit)} disabled={emailLoggingLoading || oauthLoggingLoading}>
						{emailLoggingLoading ? <Loading description='Signing in' /> : <Icon id='enter' />}
						&nbsp; Continue
					</EmailButton>
					<Divider>
						<HorizontalLine />
						<span>Or</span>
						<HorizontalLine />
					</Divider>
					<GoogleButton variant='fill' disabled={emailLoggingLoading || oauthLoggingLoading} onClick={handleGoogleLogin}>
						{oauthLoggingLoading ? <Loading description='Signing in' /> : <Icon id='globe' />}
						&nbsp; Continue With Google
					</GoogleButton>
					{error && errorMsgEle}
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

var ErrorMsg = styled.p`
	color: var(--text-status-warning);
	font-size: ${14 / 16}rem;
	text-align: center;
`;

// https://next-auth.js.org/configuration/pages#sign-in-page
var ErrorCodes = {
	OAuthAccountNotLinked: 'OAuthAccountNotLinked',
	Default: 'Default',
} as const;

var ErrorMap = {
	[ErrorCodes.OAuthAccountNotLinked]: 'An account with this email already exists. Try sign in with the email method.',
	[ErrorCodes.Default]: 'Something went wrong during authentication. Please try again, and contact support if the issue continues.',
};
