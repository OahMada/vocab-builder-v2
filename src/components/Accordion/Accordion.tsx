'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as AccordionPrimitives from '@radix-ui/react-accordion';

import Icon from '@/components/Icon';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';

type MultipleAccordionProps = React.ComponentProps<typeof AccordionPrimitives.Root> & AccordionPrimitives.AccordionMultipleProps;

function AccordionRoot({ children, ...delegated }: Omit<MultipleAccordionProps, 'type'>) {
	return (
		<Root type='multiple' {...delegated}>
			{children}
		</Root>
	);
}

function AccordionItem({ id, children, ...delegated }: { id: string; children: React.ReactNode } & React.ComponentProps<'div'>) {
	return (
		<Item value={id} {...delegated}>
			{children}
		</Item>
	);
}

function AccordionTrigger({ children, ...delegated }: React.ComponentProps<typeof AccordionPrimitives.Trigger>) {
	let [isOpen, setIsOpen] = React.useState(false);

	function handleOnclick(event: React.MouseEvent<HTMLButtonElement>) {
		// click on the element causes the state flip
		let previousOpenState = event.currentTarget.dataset.state;
		setIsOpen(!(previousOpenState === 'open'));
	}

	return (
		<Header>
			{children}
			<AccordionPrimitives.Trigger {...delegated} asChild={true} onClick={handleOnclick}>
				<ExpandButton variant='icon'>
					<VisuallyHidden>Expand Accordion</VisuallyHidden>
					{isOpen ? <Icon id='minus' /> : <Icon id='plus' />}
				</ExpandButton>
			</AccordionPrimitives.Trigger>
		</Header>
	);
}

function AccordionContent({ children }: React.ComponentProps<typeof AccordionPrimitives.Content>) {
	return <AccordionPrimitives.Content>{children}</AccordionPrimitives.Content>;
}

export { AccordionContent, AccordionRoot, AccordionTrigger, AccordionItem };

var Root = styled(AccordionPrimitives.Root)`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 6px;
	--overall-padding: 12px;
	--border-radius: 12px;
	position: absolute;
	top: 0;
	left: 0;
	transform: var(--transform);
`;

var Item = styled(AccordionPrimitives.Item)`
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-elevation-low);
`;

var Header = styled(AccordionPrimitives.Header)`
	font-size: 1rem;
	font-weight: 450;
	background-color: var(--bg-secondary);
	padding: var(--overall-padding);
	padding-top: 8px;
	text-wrap: pretty;
	border-radius: inherit;
	display: flex;
	align-items: baseline;
	gap: 5px;

	&[data-state='open'] {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 2px solid var(--bg-tertiary);
	}
`;

var ExpandButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	margin-left: auto;
	transform: translateY(3px);
`;
