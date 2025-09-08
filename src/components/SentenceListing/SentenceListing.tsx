'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useSearchParams } from 'next/navigation';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import EmptyDisplay from './EmptyDisplay';
import { useIntersectionObserver } from '@/hooks';
import readAllSentences from '@/app/actions/sentence/readAllSentences';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { SentenceWithHighlightedPieces } from '@/types';
import { INPUT_NAME } from '@/constants';
import searchSentences from '@/app/actions/sentence/searchSentence';

function SentenceListing({
	sentences,
	cursor,
	initialError,
}: {
	sentences: SentenceWithHighlightedPieces[];
	cursor?: string;
	initialError?: string;
}) {
	let [currentSentences, setCurrentSentences] = React.useState(sentences);
	let [nextCursor, setNextCursor] = React.useState<string | undefined>(cursor);
	let [isLoadingData, startTransition] = React.useTransition();
	let [error, setError] = React.useState<string | undefined>(initialError);

	let searchParams = useSearchParams();
	let search = searchParams.get(INPUT_NAME.SEARCH);

	// both used for data fetching indicator
	let [ref, isIntersecting] = useIntersectionObserver<HTMLSpanElement>();

	// virtualization
	let rowVirtualizer = useWindowVirtualizer({
		count: currentSentences.length,
		estimateSize: () => 300,
		overscan: 6,
		gap: 6,
	});
	let virtualizedItems = rowVirtualizer.getVirtualItems();

	function onDeleteSentence(id: string) {
		let newState = currentSentences.filter((item) => item.id !== id);
		setCurrentSentences(newState);
	}
	let fetchMoreSentences = React.useCallback(
		function () {
			startTransition(async () => {
				let result: Awaited<ReturnType<typeof searchSentences>> | Awaited<ReturnType<typeof readAllSentences>>;
				if (search) {
					result = await searchSentences({ search, cursor: nextCursor });
				} else {
					result = await readAllSentences(nextCursor);
				}
				if ('error' in result) {
					setError(result.error);
					return;
				}
				let { data, nextCursor: newCursor } = result;
				setCurrentSentences((prev) => [...prev, ...data]);
				setNextCursor(newCursor ?? undefined);
			});
		},
		[nextCursor, search]
	);

	// fetch when nearing the page end
	React.useEffect(() => {
		if (!nextCursor || isLoadingData || error) return;
		let lastItem = virtualizedItems.at(-1);
		if (!lastItem) return;
		// if rendered items(plus overscan) reaches the end, fetch new
		if (lastItem.index >= currentSentences.length - 1) {
			fetchMoreSentences();
		}
	}, [fetchMoreSentences, isLoadingData, nextCursor, currentSentences.length, virtualizedItems, error]);

	// fetch when loading indication is shown, fallback for scroll fetching
	React.useEffect(() => {
		if (!nextCursor || isLoadingData || error) return;
		if (isIntersecting) fetchMoreSentences();
	}, [nextCursor, fetchMoreSentences, isIntersecting, isLoadingData, error]);

	if (currentSentences.length === 0 && !error) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper>
			<SecondaryWrapper style={{ '--height': `${rowVirtualizer.getTotalSize()}px` } as React.CSSProperties}>
				<AccordionRoot style={{ '--transform': `translateY(${virtualizedItems[0]?.start || 0}px)` } as React.CSSProperties}>
					{virtualizedItems.map((virtualItem) => {
						let index = virtualItem.index;
						let { id, ...rest } = currentSentences[index];

						return (
							<SentenceListingEntry
								data-index={index}
								ref={rowVirtualizer.measureElement}
								key={id}
								index={index}
								id={id}
								{...rest}
								onDeleteSentence={onDeleteSentence}
							/>
						);
					})}
				</AccordionRoot>
			</SecondaryWrapper>
			{nextCursor && <InnerWrapper>{!error && <Loading ref={ref}>Loading...</Loading>}</InnerWrapper>}
			{error && (
				<InnerWrapper>
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
				</InnerWrapper>
			)}
		</Wrapper>
	);
}

export default SentenceListing;

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
