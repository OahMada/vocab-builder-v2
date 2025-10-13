'use client';

import * as React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import browse_and_search_thumbnail from '@/../public/media/browse_and_search_thumbnail.png';
import sentence_page_thumbnail from '@/../public/media/sentence_page_thumbnail.png';

import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';

var ImageMap = {
	sentence_page_thumbnail,
	browse_and_search_thumbnail,
};

function Video({ placeholderFileName, ...delegated }: { placeholderFileName: keyof typeof ImageMap } & React.ComponentProps<'video'>) {
	let [isPlaying, setIsPlaying] = React.useState(true);
	let videoEleRef = React.useRef<null | HTMLVideoElement>(null);
	let [loaded, setLoaded] = React.useState(false);

	function toggleVideoPlay() {
		if (!loaded) return;
		let video = videoEleRef.current;
		if (!video) return;
		if (video.paused) {
			video.play();
			setIsPlaying(true);
		} else {
			video.pause();
			setIsPlaying(false);
		}
	}

	return (
		<Wrapper style={{ '--overlay-opacity': isPlaying ? '0' : '1' } as React.CSSProperties}>
			{!loaded && <Poster fill={true} src={ImageMap[placeholderFileName]} alt='browse and search thumbnail' placeholder='blur' />}
			<VideoEle
				as='video'
				playsInline={true}
				loop={true}
				autoPlay={true}
				muted={true}
				ref={videoEleRef}
				onClick={toggleVideoPlay}
				{...delegated}
				onLoadedData={() => setLoaded(true)}
			/>
			{loaded && (
				<PlayButtonSquare>
					{isPlaying ? (
						<>
							<PauseIcon id='stop' size={25} strokeWidth={2} />
							<VisuallyHidden>play video</VisuallyHidden>
						</>
					) : (
						<>
							<PlayIcon id='play' size={25} strokeWidth={2} />
							<VisuallyHidden>stop video</VisuallyHidden>
						</>
					)}
				</PlayButtonSquare>
			)}
		</Wrapper>
	);
}

export default Video;

var Wrapper = styled.div`
	position: relative;
	aspect-ratio: 4 / 3;
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		opacity: var(--overlay-opacity);
		pointer-events: none;
		background-color: hsl(0 0% 0% / 25%);
	}
`;

var VideoEle = styled.video`
	border-radius: 3px;
	height: 100%;
	width: 100%;
	cursor: pointer;
`;

var PlayButtonSquare = styled.div`
	// centering trick
	position: absolute;
	inset: 0;
	margin: auto;
	width: 60px;
	height: 60px;

	display: grid;
	place-content: center;
	border-radius: 100%;
	background-color: hsl(0 0% 0% / 0.5);
	opacity: 0;
	transition: opacity 150ms ease-out;
	pointer-events: none;
	// to place above overlay
	z-index: 2;

	@media (hover: hover) {
		${Wrapper}:hover & {
			opacity: 1;
			transition: opacity 200ms ease-in;
		}
	}
`;

var PlayIcon = styled(Icon)`
	// optical alignment
	transform: translateX(2px);
	color: hsl(0 0% 100%);
`;

var PauseIcon = styled(Icon)`
	color: hsl(0 0% 100%);
`;

var Poster = styled(Image)`
	border-radius: 3px;
`;
