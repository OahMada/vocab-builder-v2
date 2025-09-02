'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import { SentenceWithPieces } from '@/lib';
import EmptyDisplay from './EmptyDisplay';
import { useIntersectionObserver, useIsScrollingToEnd } from '@/hooks';
import readAllSentences from '@/app/actions/sentence/readAllSentences';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function OptimisticSentenceListing({ sentences, cursor }: { sentences: SentenceWithPieces[]; cursor?: string }) {
	let [data, setData] = React.useState(sentences);
	let [isLoadingData, startTransition] = React.useTransition();
	let [nextCursor, setNextCursor] = React.useState<string | undefined>(cursor);
	let [error, setError] = React.useState<string | undefined>(undefined);
	let [optimisticSentences, mutateSentences] = React.useOptimistic<SentenceWithPieces[], string>(data, (state, id) => {
		return state.filter((item) => item.id !== id);
	});

	let [ref, isIntersecting] = useIntersectionObserver<HTMLSpanElement>();
	let isScrollingToEnd = useIsScrollingToEnd(isLoadingData);

	let fetchMoreSentences = React.useCallback(
		function () {
			startTransition(async () => {
				let result = await readAllSentences(nextCursor);
				// result = { error: 'failed to load more sentences' };
				if ('error' in result) {
					setError(result.error);
					return;
				}
				let { data, nextCursor: newCursor } = result;
				setData((prev) => [...prev, ...data]);
				setNextCursor(newCursor ?? undefined);
			});
		},
		[nextCursor]
	);

	// fetch when nearing the page end
	React.useEffect(() => {
		if (!nextCursor || isLoadingData) return;
		if (isScrollingToEnd) {
			fetchMoreSentences();
		}
	}, [fetchMoreSentences, isLoadingData, isScrollingToEnd, nextCursor]);

	// fetch when loading indication is shown, fallback for scroll fetching
	React.useEffect(() => {
		if (!nextCursor || isLoadingData) return;
		if (isIntersecting) fetchMoreSentences();
	}, [nextCursor, fetchMoreSentences, isIntersecting, isLoadingData]);

	if (optimisticSentences.length === 0) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper>
			<AccordionRoot>
				{optimisticSentences.map(({ id, ...rest }, index) => {
					return <SentenceListingEntry key={id} index={index} id={id} {...rest} mutateSentences={mutateSentences} />;
				})}
			</AccordionRoot>
			{nextCursor && (
				<InnerWrapper>
					{!error && <Loading ref={ref}>Loading...</Loading>}
					{error && (
						<>
							<ErrorMsg>{error}</ErrorMsg>
							<Button
								variant='outline'
								onClick={() => {
									setError(undefined);
									fetchMoreSentences();
								}}
							>
								<Icon id='retry' />
								&nbsp;Retry
							</Button>
						</>
					)}
				</InnerWrapper>
			)}
		</Wrapper>
	);
}

export default OptimisticSentenceListing;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	isolation: isolate;
	width: 100%;
	flex: 1;
`;

var Loading = styled.span`
	align-self: center;
	font-size: 0.8rem;
	font-weight: 350;
	color: var(--text-tertiary);
`;

var InnerWrapper = styled.div`
	align-self: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: var(--text-secondary);
	gap: 5px;
	margin-bottom: 8px;
`;
var ErrorMsg = styled.p`
	color: var(--text-status-warning);
	font-size: ${14 / 16}rem;
`;
