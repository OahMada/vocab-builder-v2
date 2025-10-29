'use client';

import * as React from 'react';
import styled from 'styled-components';

import { QUERIES } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

function Pricing() {
	return (
		<>
			<Wrapper>
				<PricingCard>
					<PricingNameWrapper>
						<PricingName>Monthly</PricingName>
						<PricingDescription>Perfect for beginners. Explore and learn at your own pace.</PricingDescription>
					</PricingNameWrapper>
					<PriceTagWrapper>
						<PriceTag>
							$3 <CurrencyUnit>USD</CurrencyUnit>
						</PriceTag>
						<BillingInfo>/ month</BillingInfo>
					</PriceTagWrapper>
					<SubscribeButton variant='fill'>
						<Icon id='forward' />
						&nbsp;Get Started
					</SubscribeButton>
				</PricingCard>
				<PricingCard>
					<PricingNameWrapper>
						<PricingName>Every 6 months</PricingName>
						<PricingDescription>Stay consistent. Save time and money while building your vocabulary.</PricingDescription>
					</PricingNameWrapper>
					<PriceTagWrapper>
						<PriceTag>
							$15 <CurrencyUnit>USD</CurrencyUnit>
						</PriceTag>
						<BillingInfo>/ 6 months</BillingInfo>
					</PriceTagWrapper>
					<SubscribeButton variant='fill'>
						<Icon id='forward' />
						&nbsp;Get Started
					</SubscribeButton>
				</PricingCard>
				<PricingCard>
					<PricingNameWrapper>
						<PricingName>Yearly</PricingName>
						<PricingDescription>Maximize your growth. The ultimate plan for serious learners.</PricingDescription>
					</PricingNameWrapper>
					<PriceTagWrapper>
						<PriceTag>
							$27 <CurrencyUnit>USD</CurrencyUnit>
						</PriceTag>
						<BillingInfo>/ year</BillingInfo>
					</PriceTagWrapper>
					<SubscribeButton variant='fill'>
						<Icon id='forward' />
						&nbsp;Get Started
					</SubscribeButton>
				</PricingCard>
			</Wrapper>
		</>
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
`;

var SubscribeButton = styled(Button)`
	width: 80%;
	margin-top: 12px;
	align-self: center;
`;
