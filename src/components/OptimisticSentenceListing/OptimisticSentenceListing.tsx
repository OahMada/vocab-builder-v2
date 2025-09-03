'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import { SentenceWithPieces } from '@/lib';
import EmptyDisplay from './EmptyDisplay';
import { useIntersectionObserver } from '@/hooks';
import readAllSentences from '@/app/actions/sentence/readAllSentences';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function OptimisticSentenceListing({ sentences, cursor }: { sentences: SentenceWithPieces[]; cursor?: string }) {
	let [data, setData] = React.useState(sentences);
	let [nextCursor, setNextCursor] = React.useState<string | undefined>(cursor);
	let [isLoadingData, startTransition] = React.useTransition();
	let [error, setError] = React.useState<string | undefined>(undefined);

	// only useful for quickly updating list after sentence deletion
	let [optimisticSentences, mutateSentences] = React.useOptimistic<SentenceWithPieces[], string>(data, (state, id) => {
		return state.filter((item) => item.id !== id);
	});

	console.log('optimisticSentences', optimisticSentences);

	// both used for data fetching indicator
	let [ref, isIntersecting] = useIntersectionObserver<HTMLSpanElement>();

	let listRef = React.useRef<HTMLDivElement | null>(null);
	let rowVirtualizer = useWindowVirtualizer({
		count: optimisticSentences.length,
		estimateSize: () => 200,
		overscan: 6,
		gap: 6,
	});

	let virtualizedItems = rowVirtualizer.getVirtualItems();

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
		let lastItem = virtualizedItems.at(-1);
		if (!lastItem) return;
		// If we're rendering within 5 items of the end, fetch more
		if (lastItem.index >= optimisticSentences.length - 1) {
			fetchMoreSentences();
		}
	}, [fetchMoreSentences, isLoadingData, nextCursor, optimisticSentences.length, virtualizedItems]);

	// fetch when loading indication is shown, fallback for scroll fetching
	React.useEffect(() => {
		if (!nextCursor || isLoadingData) return;
		if (isIntersecting) fetchMoreSentences();
	}, [nextCursor, fetchMoreSentences, isIntersecting, isLoadingData]);

	if (optimisticSentences.length === 0) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper ref={listRef}>
			<SecondaryWrapper style={{ '--height': `${rowVirtualizer.getTotalSize()}px` } as React.CSSProperties}>
				<AccordionRoot style={{ '--transform': `translateY(${virtualizedItems[0]?.start || 0}px)` } as React.CSSProperties}>
					{virtualizedItems.map((virtualItem) => {
						let index = virtualItem.index;
						let { id, ...rest } = optimisticSentences[index];

						return (
							<SentenceListingEntry
								data-index={index}
								key={id}
								index={index}
								id={id}
								{...rest}
								mutateSentences={mutateSentences}
								ref={rowVirtualizer.measureElement}
							/>
						);
					})}
				</AccordionRoot>
			</SecondaryWrapper>
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
	isolation: isolate;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

var SecondaryWrapper = styled.div`
	position: relative;
	height: var(--height);
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
