'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';

var Data = [
	{
		id: '0',
		sentence: 'Hello there, what do you do for a living? Me? I&apos;m homeless.',
		translation:
			'北美森林正面临一场金色入侵——原产东亚的金平菇(Golden oyster mushrooms, GOM)通过园艺贸易逃逸至野外后，展现出惊人的扩张能力。这种白色腐朽真菌专性分解硬木，自 2010 年首次在北美被发现后，短短 8 年间已攻占 25 个州和 1 个加拿大省份的林地。',
		note: "I don't have a note",
	},
	{
		id: '1',
		sentence: 'Hello there, what do you do for a living?',
		translation:
			'北美森林正面临一场金色入侵——原产东亚的金平菇(Golden oyster mushrooms, GOM)通过园艺贸易逃逸至野外后，展现出惊人的扩张能力。这种白色腐朽真菌专性分解硬木，自 2010 年首次在北美被发现后，短短 8 年间已攻占 25 个州和 1 个加拿大省份的林地。',
		note: '',
	},
	{
		id: '2',
		sentence: 'Hello there, what do you do for a living? Me? I&apos;m homeless. Hello there, what do you do for a living?',
		translation: '吃饭了',
		note: 'I do have a note.',
	},
];

function SentenceListing() {
	return (
		<Wrapper>
			<AccordionRoot>
				{Data.map(({ id, sentence, note, translation }, index) => {
					return <SentenceListingEntry key={id} id={id} index={index} translation={translation} note={note} sentence={sentence} />;
				})}
			</AccordionRoot>
		</Wrapper>
	);
}

export default SentenceListing;

var Wrapper = styled.div`
	color: var(--text-primary);
	width: 100%;
`;
