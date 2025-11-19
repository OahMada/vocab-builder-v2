'use client';

import * as React from 'react';
import styled from 'styled-components';

import { QUERIES, PRICE_TIER } from '@/constants';
import { usePaddlePrices } from '@/hooks';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import PricePlaceHolder from '@/components/PricePlaceHolder';

function Pricing({ isAuthenticated }: { isAuthenticated: boolean }) {
	let { loading, currencyCode, priceMap } = usePaddlePrices();
	return (
		<Wrapper>
			{PRICE_TIER.map((item) => {
				return (
					<PricingCard key={item.priceId}>
						<PricingNameWrapper>
							<PricingName>{item.name}</PricingName>
							<PricingDescription>{item.description}</PricingDescription>
						</PricingNameWrapper>
						<PriceTagWrapper>
							{loading ? (
								<PricePlaceHolder style={{ '--width': '80px', '--height': `calc(${20 / 16}rem * 1.5)` } as React.CSSProperties} />
							) : (
								<PriceTag>
									{priceMap[item.priceId]} <CurrencyUnit>{currencyCode}</CurrencyUnit>
								</PriceTag>
							)}
							<BillingInfo>{item.billingCycle}</BillingInfo>
						</PriceTagWrapper>
						{isAuthenticated ? (
							<SubscribeButton variant='fill' href={`/checkout/${item.priceId}`}>
								<Icon id='forward' />
								&nbsp;Subscribe
							</SubscribeButton>
						) : (
							<SubscribeButton variant='fill' href='/auth/login?callback=/pricing'>
								<Icon id='forward' />
								&nbsp;Get Started
							</SubscribeButton>
						)}
					</PricingCard>
				);
			})}
		</Wrapper>
	);
}

export default Pricing;

var Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 24px;
	align-items: center;

	@media ${QUERIES.laptopAndUp} {
		flex-direction: row;
	}
`;

var PricingCard = styled.article`
	background-color: var(--bg-secondary);
	border-radius: 12px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	flex: 1;
	min-width: 250px;
	max-width: min(100%, 450px);
	position: relative;
`;

var PricingNameWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

var PriceTagWrapper = styled.div`
	margin-top: auto;
	display: flex;
	flex-direction: column;
`;

var PricingName = styled.h3`
	font-size: ${20 / 16}rem;
	font-weight: 500;
`;

var PricingDescription = styled.p``;

var PriceTag = styled.span`
	font-size: ${20 / 16}rem;
	font-weight: 500;
`;

var CurrencyUnit = styled.span`
	font-weight: 900;
	font-size: 12px;
`;

var BillingInfo = styled.span`
	color: var(--text-secondary);
	transform: translateX(2px);
`;

var SubscribeButton = styled(Button)`
	width: 80%;
	margin-top: 12px;
	align-self: center;
`;
