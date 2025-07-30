// your-select.jsx
import * as React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import styled from 'styled-components';

export function Select({ id, children, ...props }: { id: string } & React.ComponentProps<typeof SelectPrimitives.Root>) {
	return (
		<SelectPrimitives.Root {...props}>
			<SelectPrimitives.Trigger asChild={true} id={id}>
				<Button variant='fill'>
					<SelectPrimitives.Value />
					&nbsp;
					<SelectPrimitives.Icon>
						<Icon id='chevron-down' />
					</SelectPrimitives.Icon>
				</Button>
			</SelectPrimitives.Trigger>
			<SelectPrimitives.Portal>
				<Content>
					<SelectPrimitives.ScrollUpButton asChild={true}>
						<ScrollButton variant='icon'>
							<Icon id='chevron-up' />
						</ScrollButton>
					</SelectPrimitives.ScrollUpButton>
					<Viewport>{children}</Viewport>
					<SelectPrimitives.ScrollDownButton asChild={true}>
						<ScrollButton variant='icon'>
							<Icon id='chevron-down' />
						</ScrollButton>
					</SelectPrimitives.ScrollDownButton>
				</Content>
			</SelectPrimitives.Portal>
		</SelectPrimitives.Root>
	);
}

var Content = styled(SelectPrimitives.Content)`
	/* hide the options that are outside of the viewport */
	overflow: hidden;
	background-color: var(--bg-tertiary);
	border-radius: 20px;
	box-shadow: var(--shadow-elevation-medium);
`;

var Viewport = styled(SelectPrimitives.Viewport)`
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 3px;
	text-align: right;
`;

var ScrollButton = styled(Button)`
	padding: 0;
	--hover-bg-color: transparent;
`;

export function SelectItem({ children, ...props }: React.ComponentProps<typeof SelectPrimitives.Item>) {
	return (
		<Item {...props}>
			<SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
			<ItemIndicator>
				<Icon id='accept' size={16} />
			</ItemIndicator>
		</Item>
	);
}

var Item = styled(SelectPrimitives.Item)`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	border-radius: 12px;
	position: relative;
	user-select: none;
	padding: 6px 10px;
	padding-right: 30px;

	/* replace outline with custom background color */
	outline: none;

	&[data-highlighted] {
		background-color: var(--bg-secondary);
	}

	@media (hover: hover) {
		&:hover {
			background-color: var(--bg-secondary);
		}
	}
	&:active {
		background-color: var(--bg-secondary);
	}
`;

var ItemIndicator = styled(SelectPrimitives.ItemIndicator)`
	position: absolute;
	right: 10px;
`;
