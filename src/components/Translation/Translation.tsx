'use client';

import * as React from 'react';
import styled from 'styled-components';
import Spacer from '@/components/Spacer';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import UnstyledButton from '@/components/UnstyledButton';
import Textarea from '@/components/Textarea';
import AcceptButton from '@/components/AcceptButton';
import CancelButton from '@/components/CancelButton';

function Translation() {
	let [isEditing, setIsEditing] = React.useState(false);

	return (
		<Wrapper>
			<Title>Translation</Title>
			<Spacer size={18} />
			{isEditing ? (
				<>
					<Textarea />
					<Spacer size={12} />
					<ActionButtons>
						<CancelButton />
						<AcceptButton />
					</ActionButtons>
				</>
			) : (
				<TranslationText>
					如果时间是一条河，我愿永远在你微笑的河流中航行， 被你心中那温柔的引力所承载。
					<EditButton display='inline-block' onClick={() => setIsEditing(true)}>
						<Icon id='edit' size={18} />
						<VisuallyHidden>Edit Translation Text</VisuallyHidden>
					</EditButton>
				</TranslationText>
			)}
		</Wrapper>
	);
}

export default Translation;

var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-primary);
	width: 100%;
	padding: 12px;
	border-radius: 24px;
`;

var Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1;
	margin-top: 8px;
`;

var TranslationText = styled.p``;

var EditButton = styled(UnstyledButton)`
	vertical-align: -2.5px;
	margin-left: 3px;
	padding: 6px;
	padding-right: 5px;
	border-radius: 6px;

	@media (hover: hover) {
		&:hover {
			background-color: var(--bg-tertiary);
		}
	}
`;

var ActionButtons = styled.div`
	display: flex;
	gap: 8px;
	justify-content: flex-end;
`;
