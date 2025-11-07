'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as m from 'motion/react-m';
import { LazyMotion } from 'motion/react';

import { TabsList, TabsRoot, TabsTrigger } from '@/components/Tabs';
import { Button } from '@/components/Button';

var loadFeatures = () => import('@/lib/motionDomMax').then((res) => res.default);

var tabsMap = [
	{ value: 'settings', label: 'Settings' },
	{ value: 'subscription', label: 'Subscription' },
] as const;

type TabValue = (typeof tabsMap)[number]['value'];

export default function Tab({ children }: { children: React.ReactNode }) {
	let [active, setActive] = React.useState<TabValue>('settings');

	function handleChange(value: string) {
		let val = value as TabValue;
		setActive(val);
	}

	return (
		<LazyMotion features={loadFeatures}>
			<TabsRoot defaultValue='settings' value={active} onValueChange={handleChange}>
				<TabsList>
					{tabsMap.map((tab) => {
						let isActive = active === tab.value;
						return (
							<TabsTrigger asChild={true} value={tab.value} key={tab.value}>
								<TabButton variant='icon'>
									{isActive && <Background layoutId='active-bg' transition={{ duration: 0.15 }} />}
									<LabelText>{tab.label}</LabelText>
								</TabButton>
							</TabsTrigger>
						);
					})}
				</TabsList>
				{children}
			</TabsRoot>
		</LazyMotion>
	);
}

var TabButton = styled(Button)`
	--padding: 6px 8px;
	flex: 1;
	font-size: ${14 / 16}rem;
	font-weight: 800;
	color: var(--text-secondary);
	border-radius: inherit;
	position: relative;
`;

var Background = styled(m.span)`
	display: inline-block;
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1;
	border-radius: inherit;

	${TabButton}[data-state='active'] & {
		background-color: var(--bg-secondary);
	}
	${TabButton}[data-state='active']:hover & {
		background-color: var(--bg-secondary-hover);
	}
`;

var LabelText = styled.span`
	position: relative;
	z-index: 2;
`;
