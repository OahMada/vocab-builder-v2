'use client';

import { type CheckoutEventsData, type Environments, initializePaddle } from '@paddle/paddle-js';
import * as React from 'react';
import styled from 'styled-components';

import getCustomerAuthToken from '@/app/actions/subscription/getCustomerAuthToken';
import revivePaddleCustomer from '@/app/actions/subscription/revivePaddleCustomer';

import { useTheme } from '@/hooks';
import { Theme } from '@/types';
import { formatBillingCycle, formatMoney } from '@/helpers';
import { TOAST_ID } from '@/constants';

import PricePlaceHolder from '@/components/PricePlaceHolder';
import NavLink from '@/components/NavLink';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

function Checkout({ priceId, userInfo, initialTheme }: { priceId: string; userInfo: { email: string; userId: string }; initialTheme: Theme }) {
	let { email, userId } = userInfo;
	let [checkoutData, setCheckoutData] = React.useState<CheckoutEventsData | null>(null);
	let { addToToast } = useGlobalToastContext();

	let recurringTotal = checkoutData?.recurring_totals?.total;
	let billingCycle = checkoutData?.items[0].billing_cycle;
	let currency = checkoutData?.currency_code;
	let total = checkoutData?.totals.total;
	let tax = checkoutData?.totals.tax;
	let subTotal = checkoutData?.totals.subtotal;

	let theme = useTheme(initialTheme);
	function handleCheckoutEvents(event: CheckoutEventsData) {
		setCheckoutData(event);
	}

	React.useEffect(() => {
		async function openCheckout() {
			let authToken: string | undefined = undefined;

			// existing customer for example subscription expired, needs to re-subscribe
			let fetchAuthTokenResult = await getCustomerAuthToken();
			if (!('error' in fetchAuthTokenResult)) {
				authToken = fetchAuthTokenResult.data;
			}

			// for the edge case where user have once deleted their account and recrate a account using same email address
			let reviveResult = await revivePaddleCustomer(email);
			if ('error' in reviveResult) {
				addToToast({
					content: reviveResult.error,
					contentType: 'error',
					id: TOAST_ID.REVIVE_PADDLE_CUSTOMER,
				});
				return;
			}

			let paddle = await initializePaddle({
				token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
				environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
				eventCallback: (event) => {
					if (event.data && event.name) {
						handleCheckoutEvents(event.data);
					}
				},
				checkout: {
					settings: {
						variant: 'one-page',
						displayMode: 'inline',
						theme,
						allowLogout: false,
						frameTarget: 'checkout-container',
						frameInitialHeight: 450,
						frameStyle: 'width: 100%; background-color: transparent; border: none; min-width: 286px;',
						successUrl: '/checkout/success',
					},
				},
			});

			// to show the saved payment method when an existing customer pays again
			if (authToken) {
				paddle?.Checkout.open({
					customerAuthToken: authToken,
					items: [{ priceId: priceId, quantity: 1 }],
					customData: {
						userId,
						email,
					},
				});
			} else {
				paddle?.Checkout.open({
					items: [{ priceId: priceId, quantity: 1 }],
					customer: { email },
					customData: {
						userId,
						email,
					},
				});
			}
		}

		openCheckout();
	}, [addToToast, email, priceId, theme, userId]);

	return (
		<Wrapper>
			<OrderWrapper>
				<Title>Order Details</Title>
				<InnerWrapper>
					{recurringTotal !== undefined ? (
						<>
							<TotalPriceWrapper>
								<TotalPrice>{formatMoney(recurringTotal, currency)}</TotalPrice>
								<span>inc. tax</span>
							</TotalPriceWrapper>
							{billingCycle && (
								<BillingCycleWrapper>
									then {formatMoney(recurringTotal, currency)} {formatBillingCycle(billingCycle!)}
								</BillingCycleWrapper>
							)}
						</>
					) : (
						<>
							<PricePlaceHolder style={{ '--width': '100%', '--height': '3rem' } as React.CSSProperties} />
							<PricePlaceHolder style={{ '--width': '100%', '--height': `calc(1rem * 1.5)` } as React.CSSProperties} />
						</>
					)}
				</InnerWrapper>
				<PriceDetailWrapper>
					<Divider />
					<PriceDetailListing>
						<span>Subtotal</span>
						{subTotal !== undefined ? (
							<Value>{formatMoney(subTotal, currency)}</Value>
						) : (
							<PricePlaceHolder style={{ '--width': '100px', '--height': `calc(1rem * 1.5)` } as React.CSSProperties} />
						)}
					</PriceDetailListing>
					<PriceDetailListing>
						<span>Tax</span>
						{tax !== undefined ? (
							<Value>{formatMoney(tax, currency)}</Value>
						) : (
							<PricePlaceHolder style={{ '--width': '100px', '--height': `calc(1rem * 1.5)` } as React.CSSProperties} />
						)}
					</PriceDetailListing>
					<Divider />
					<PriceDetailListing>
						<span>Total</span>

						{total !== undefined ? (
							<Value>{formatMoney(total, currency)}</Value>
						) : (
							<PricePlaceHolder style={{ '--width': '100px', '--height': `calc(1rem * 1.5)` } as React.CSSProperties} />
						)}
					</PriceDetailListing>
				</PriceDetailWrapper>
				<RefoundPolicyLink href='#'>Refund Policy</RefoundPolicyLink>
			</OrderWrapper>
			<PaymentWrapper>
				<Title>Payment Details</Title>
				<div className='checkout-container'></div>
			</PaymentWrapper>
		</Wrapper>
	);
}

export default Checkout;

var Wrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(min(290px, 100%), 1fr));
	background-color: var(--bg-secondary);
	padding: 24px;
	border-radius: 12px;
	height: 100%;
	gap: 60px;
`;

var OrderWrapper = styled.section`
	display: flex;
	flex-direction: column;
	gap: 30px;
`;
var PaymentWrapper = styled.section`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;
var InnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

var Divider = styled.div`
	margin-top: 20px;
	border-top: 1px solid var(--border);
`;
var Title = styled.h2`
	font-size: 1rem;
	color: var(--text-secondary);
	font-weight: 800;
`;

var TotalPriceWrapper = styled.div`
	display: flex;
	gap: 8px;
	align-items: baseline;
`;

var TotalPrice = styled.span`
	font-size: 3rem;
	line-height: 1;
`;

var BillingCycleWrapper = styled.div`
	color: var(--text-tertiary);
	font-weight: 600;
`;

var PriceDetailWrapper = styled.div`
	color: var(--text-tertiary);
	font-weight: 600;
`;

var PriceDetailListing = styled.div`
	padding-top: 20px;
	display: flex;
	justify-content: space-between;
`;

var Value = styled.span`
	color: var(--text-primary);
`;

var RefoundPolicyLink = styled(NavLink)`
	color: var(--text-secondary);
	font-size: ${14 / 16}rem;
	align-self: flex-end;
	font-weight: 600;
`;
