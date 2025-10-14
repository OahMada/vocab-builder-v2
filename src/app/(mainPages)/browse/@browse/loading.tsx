import * as React from 'react';

import NoticeText from '@/components/BrowsePageNoticeText';
import { LoadingFallback, LoadingWrapper, LoadingText } from '../StyledComponents';

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
