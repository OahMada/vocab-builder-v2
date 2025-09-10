'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import { readAllSentences } from '@/app/actions/sentence/readAllSentences';
import { searchSentences } from '@/app/actions/sentence/searchSentence';

import { useIntersectionObserver } from '@/hooks';
import { SentenceWithPieces } from '@/lib';

import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import EmptyDisplay from './EmptyDisplay';
import Spinner from '@/components/Loading';
import { useSearchParamsContext } from '@/components/SearchParamsProvider';
import NoticeText from '@/components/BrowsePageNoticeText';
import { markSearchMatchesInSentencePieces } from '@/helpers';

function SentenceListing({
	sentences,
	cursor,
	initialError,
	countMessage,
	hasCountError,
}: {
	sentences: SentenceWithPieces[];
	cursor: string | undefined;
	initialError: string | undefined;
	countMessage: string;
	hasCountError: boolean;
}) {
	let [currentSentences, setCurrentSentences] = React.useState(sentences);
	let [nextCursor, setNextCursor] = React.useState<string | undefined>(cursor);
	let [isLoadingData, startTransition] = React.useTransition();
	let [error, setError] = React.useState<string | undefined>(initialError);
	let { search, isPending } = useSearchParamsContext();

	// used for data fetching indicator
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
					result = await readAllSentences({ cursor: nextCursor });
				}
				if ('error' in result) {
					setError(result.error);
					return;
				}

				let { data, nextCursor: newCursor } = result;
				let markedData = markSearchMatchesInSentencePieces(data, search);

				setError('');
				setCurrentSentences((prev) => [...prev, ...markedData]);
				setNextCursor(newCursor ?? undefined);
			});
		},
		[nextCursor, search]
	);

	function retryFetchingData() {
		fetchMoreSentences();
	}

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

	if (currentSentences.length === 0 && !error && !isLoadingData) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper>
			<NoticeText $hasError={hasCountError}>{countMessage}</NoticeText>
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
			{nextCursor && !error && <Loading ref={ref}>Loading...</Loading>}
			{error && (
				<InnerWrapper>
					<ErrorMsg>{error}</ErrorMsg>
					<Button variant='outline' onClick={retryFetchingData}>
						{isLoadingData ? <Spinner description='retrying fetching data' /> : <Icon id='retry' />}
						&nbsp;Retry
					</Button>
				</InnerWrapper>
			)}
			{isPending && (
				<Overlay>
					<OverlaySpinner description='updating page with/without search results' size={25} strokeWidth={1} />
				</Overlay>
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
	gap: 12px;
	position: relative;
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
`;
var ErrorMsg = styled.p`
	color: var(--text-status-warning);
	font-size: ${14 / 16}rem;
`;

var Overlay = styled.div`
	height: 100%;
	width: 100%;
	background-color: var(--bg-loading-overlay);
	position: absolute;
	top: 0;
	left: 0;
`;

var OverlaySpinner = styled(Spinner)`
	position: fixed;
	right: 32px;
	bottom: calc(4rem + 16px);
`;
