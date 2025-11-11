'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as m from 'motion/react-m';
import { LazyMotion } from 'motion/react';

import { TabsList, TabsRoot, TabsTrigger } from '@/components/Tabs';
import { MotionButton } from '@/components/Button';

var loadFeatures = () => import('@/lib/motionDomMax').then((res) => res.default);

var tabsMap = [
	{ value: 'settings', label: 'Settings' },
	{ value: 'subscription', label: 'Subscription' },
] as const;

type TabValue = (typeof tabsMap)[number]['value'];

export default function Tab({ children }: { children: React.ReactNode }) {
	let [active, setActive] = React.useState<TabValue>('settings');
	let id = React.useId();

	function handleChange(value: string) {
		let val = value as TabValue;
		setActive(val);
	}

	// switching from tab2 to tab1 snaps a bit, don't know why
	return (
		<LazyMotion features={loadFeatures}>
			<TabsRoot defaultValue='settings' value={active} onValueChange={handleChange}>
				<TabsList>
					{tabsMap.map((tab) => {
						let isActive = active === tab.value;
						return (
							<TabsTrigger asChild={true} value={tab.value} key={tab.value}>
								<TabButton variant='icon'>
									{isActive && (
										<Background
											layout={true}
											layoutId={id}
											transition={{
												type: 'spring',
												duration: 0.15,
												stiffness: 250,
												damping: 25,
											}}
										/>
									)}
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

var TabButton = styled(MotionButton)`
	--padding: 6px 8px;
	flex: 1;
	font-size: ${14 / 16}rem;
	font-weight: 800;
	color: var(--text-secondary);
	border-radius: inherit;
	position: relative;

	// elevate the outline to the parent wrapper
	outline: none;
`;

var Background = styled(m.div)`
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1;
	border-radius: inherit;

	${TabButton}[data-state='active'] & {
		background-color: var(--bg-secondary);
	}

	@media (hover: hover) {
		${TabButton}[data-state='active']:hover & {
			background-color: var(--bg-secondary-hover);
		}
	}
`;

var LabelText = styled.span`
	position: relative;
	z-index: 2;
`;
