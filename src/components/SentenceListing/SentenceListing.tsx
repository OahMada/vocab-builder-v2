'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useSession } from 'next-auth/react';

import { readAllSentences } from '@/app/actions/sentence/readAllSentences';
import { searchSentences } from '@/app/actions/sentence/searchSentence';

import { useIntersectionObserver, usePlayAudio } from '@/hooks';
import { SentenceWithPieces } from '@/lib';
import { SENTENCE_FETCHING_LIMIT } from '@/constants';

import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Spinner from '@/components/Loading';
import { useSearchParamsContext } from '@/components/SearchParamsProvider';
import NoticeText from '@/components/BrowsePageNoticeText';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import EmptyDisplay from './EmptyDisplay';
import BottomRightSpinner from '@/components/BottomRightSpinner';

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
	// for auth
	let { data: session, update: updateSession, status: sessionStatus } = useSession();
	let userId = session?.user?.id;
	let [isAuthenticated, setIsAuthenticated] = React.useState(true);

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
				let currentSession = await updateSession();
				if (sessionStatus !== 'loading') {
					if (!currentSession) {
						setIsAuthenticated(false);
						return;
					}

					let result: Awaited<ReturnType<typeof searchSentences>> | Awaited<ReturnType<typeof readAllSentences>> | undefined;

					if (search) {
						result = await searchSentences({ search, cursor: nextCursor, userId });
					} else {
						result = await readAllSentences({ cursor: nextCursor, userId, limit: SENTENCE_FETCHING_LIMIT });
					}
					if ('error' in result) {
						setError(result.error);
						return;
					}
					let { data, nextCursor: newCursor } = result;
					setError('');
					setCurrentSentences((prev) => [...prev, ...data]);
					setNextCursor(newCursor ?? undefined);
				}
			});
		},
		[nextCursor, search, sessionStatus, updateSession, userId]
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

	let { playAudio, stopAudio, playingId, loadingId } = usePlayAudio();

	if (!isAuthenticated) {
		return <UnauthorizedDisplay callback={search ? `/browse?search=${search}` : '/browse'} />;
	}

	if (currentSentences.length === 0 && !error && !isLoadingData && !isPending) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper>
			{currentSentences.length !== 0 && <NoticeText $hasError={hasCountError}>{countMessage}</NoticeText>}
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
								playAudio={playAudio}
								stopAudio={stopAudio}
								isPlaying={playingId === id}
								isLoading={loadingId === id}
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
					<BottomRightSpinner description='updating page with/without search results' />
				</Overlay>
			)}
		</Wrapper>
	);
}

export default SentenceListing;

var Wrapper = styled.div`
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
	gap: 5px;
`;
var ErrorMsg = styled.p`
	color: var(--text-status-warning);
	font-size: ${14 / 16}rem;
	text-align: center;
`;

var Overlay = styled.div`
	height: 100%;
	width: 100%;
	background-color: var(--bg-transparent);
	position: absolute;
	top: 0;
	left: 0;
`;
