'use client';

import * as React from 'react';
import styled from 'styled-components';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Textarea from '@/components/Textarea';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import Button from '@/components/Button';

// TODO match the position of translation text and textarea input text

function Translation({ title }: { title: React.ReactNode }) {
	let [isEditing, setIsEditing] = React.useState(false);

	return (
		<>
			{title}
			{isEditing ? (
				<>
					{/* <Textarea /> */}
					<TextareaActionButtons />
				</>
			) : (
				<TranslationText>
					如果时间是一条河，我愿永远在你微笑的河流中航行， 被你心中那温柔的引力所承载。
					<EditButton variant='icon' onClick={() => setIsEditing(true)} style={{ '--icon-size': '16px' } as React.CSSProperties}>
						<Icon id='edit' size={16} />
						<VisuallyHidden>Edit Translation Text</VisuallyHidden>
					</EditButton>
				</TranslationText>
			)}
		</>
	);
}

export default Translation;

var TranslationText = styled.p``;

var EditButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	display: inline-block;
	margin-left: 3px;
	vertical-align: -2.5px;
	/* to make sure the icon has the same height as the text */
	padding: calc((1.5 * 16px - var(--icon-size)) / 2);
	/* for optical alignment */
	padding-right: 3px;
`;
