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
				<ExpandButton variant='ghost' aria-hidden={true}>
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
`;

var Item = styled(AccordionPrimitives.Item)`
	background-color: var(--bg-modal);
	border-radius: 12px;
`;

var Header = styled(AccordionPrimitives.Header)`
	--header-padding: 12px;
	position: relative;
	font-size: 1rem;
	font-weight: 450;
	color: var(--text-primary);

	background-color: var(--bg-secondary);
	padding: 12px;
	padding-left: calc(12px + 1rem);
	padding-right: calc(12px + 1rem);
	text-wrap: pretty;
	border-radius: 12px;

	&[data-state='open'] {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 1px solid var(--bg-primary);
	}
`;

var Index = styled.span`
	font-size: 0.8rem;
	line-height: 1.5;
	position: absolute;
	left: var(--header-padding);
	top: calc(var(--header-padding) + 0.2rem);
	display: block;
	pointer-events: none;
`;

var ExpandButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	--icon-padding: 6px;
	--icon-size: 18px;
	position: absolute;
	right: var(--header-padding);
	--icon-dimension: calc(var(--icon-size) + var(--icon-padding) * 2);

	/* One line height minus the icon height, then divide the result by 2. */
	top: calc((1rem * 1.5 + 2 * var(--header-padding) - var(--icon-dimension)) / 2);
`;
