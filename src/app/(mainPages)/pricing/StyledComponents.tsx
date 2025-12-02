'use client';

import styled from 'styled-components';

import NavLink from '@/components/NavLink';

export var Title = styled.h2`
	font-size: ${24 / 16}rem;
	font-weight: 500;
	line-height: 1;
	max-width: 500px;
`;

export var TitleWrapper = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	padding: 24px;
`;

export var Description = styled.p`
	color: var(--text-secondary);
`;

export var PricingWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
	padding: 24px;
	padding-top: 0;
`;

export var RefundPolicyLink = styled(NavLink)`
	font-size: ${14 / 16}rem;
	color: var(--text-secondary);
`;
