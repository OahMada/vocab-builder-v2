'use client';

import * as React from 'react';
import * as RadioGroupPrimitives from '@radix-ui/react-radio-group';
import styled from 'styled-components';
import Button from '@/components/Button';

export var RadioGroup = styled(RadioGroupPrimitives.Root)`
	display: flex;
	justify-content: center;
	gap: 50px;
`;

export function RadioGroupItem({ value }: { value: string }) {
	return (
		<Wrapper>
			<RadioGroupPrimitives.Item value={value} id='r1' asChild={true}>
				<RadioButton variant='fill'>
					<Indicator />
				</RadioButton>
			</RadioGroupPrimitives.Item>
			<label htmlFor='r1'>{value}</label>
		</Wrapper>
	);
}

var Wrapper = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
`;

var RadioButton = styled(Button)`
	width: 20px;
	height: 20px;
	border-radius: 100%;
	padding: 0;
`;

var Indicator = styled(RadioGroupPrimitives.Indicator)`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	position: relative;

	&::after {
		content: '';
		display: block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: var(--bg-revert);
		opacity: 0.75;
	}
`;
