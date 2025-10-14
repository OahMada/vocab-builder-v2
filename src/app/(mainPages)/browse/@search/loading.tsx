import * as React from 'react';

import { LoadingFallback, LoadingText, LoadingWrapper } from '../StyledComponents';
import NoticeText from '@/components/BrowsePageNoticeText';

export default function Loading() {
	return (
		<LoadingWrapper>
			<NoticeText>Counting records...</NoticeText>
			<LoadingFallback>
				<LoadingText>Loading...</LoadingText>
			</LoadingFallback>
		</LoadingWrapper>
	);
}
