'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as AccordionPrimitives from '@radix-ui/react-accordion';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';

function AccordionRoot({ children }: { children: React.ReactNode }) {
	return <Root type='multiple'>{children}</Root>;
}

function AccordionItem({ id, children }: { id: string; children: React.ReactNode } & React.ComponentProps<'div'>) {
	return <Item value={id}>{children}</Item>;
}

function AccordionTrigger({ index, children, ...delegated }: { index: number } & React.ComponentProps<typeof AccordionPrimitives.Trigger>) {
	let [isOpen, setIsOpen] = React.useState(false);

	function handleOnclick(event: React.MouseEvent<HTMLButtonElement>) {
		// click on the element causes the state flip
		let previousOpenState = event.currentTarget.dataset.state;
		setIsOpen(!(previousOpenState === 'open'));
	}

	return (
		<Header>
			<Index>{`${index + 1}.`}</Index>
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
	display: flex;
	flex-direction: column;
	gap: 6px;
	--border-radius: 12px;
	--overall-padding: 12px;
`;

var Item = styled(AccordionPrimitives.Item)`
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-elevation-low);
`;

var Header = styled(AccordionPrimitives.Header)`
	font-size: 1rem;
	font-weight: 450;
	color: var(--text-primary);
	background-color: var(--bg-secondary);
	padding: var(--overall-padding);
	padding-top: 8px;
	text-wrap: pretty;
	border-radius: var(--border-radius);
	display: flex;
	align-items: baseline;
	gap: 5px;

	&[data-state='open'] {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 2px solid var(--bg-tertiary);
	}
`;

var Index = styled.span`
	font-size: 1rem;
	font-weight: 300;
	pointer-events: none;
`;

var ExpandButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	margin-left: auto;
	transform: translateY(3px);
`;
