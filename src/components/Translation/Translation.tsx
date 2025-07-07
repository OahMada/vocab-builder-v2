'use client';

import * as React from 'react';
import styled from 'styled-components';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Textarea from '@/components/Textarea';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import Button from '@/components/Button';

function Translation({ title }: { title: React.ReactNode }) {
	let [isEditing, setIsEditing] = React.useState(false);

	return (
		<>
			{title}
			{isEditing ? (
				<>
					<Textarea />
					<TextareaActionButtons />
				</>
			) : (
				<TranslationText>
					如果时间是一条河，我愿永远在你微笑的河流中航行， 被你心中那温柔的引力所承载。
					<EditButton variant='ghost' onClick={() => setIsEditing(true)}>
						<Icon id='edit' />
						<VisuallyHidden>Edit Translation Text</VisuallyHidden>
					</EditButton>
				</TranslationText>
			)}
		</>
	);
}

export default Translation;

var TranslationText = styled.p`
	/* for optical alignment */
	margin-top: -4px;
`;

var EditButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	display: inline-block;
	margin-left: 3px;

	/* for optical alignment */
	vertical-align: -2.5px;
	padding-right: 5px;
`;
