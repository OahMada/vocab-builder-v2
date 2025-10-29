import * as React from 'react';

import { LoadingFallback, LoadingText, LoadingWrapper } from '../StyledComponents';
import NoticeText from '@/components/BrowsePageNoticeText';
import InnerWidthWrapper from '@/components/InnerWidthWrapper';

export default function Loading() {
	return (
		<InnerWidthWrapper>
			<LoadingWrapper>
				<NoticeText>Counting records...</NoticeText>
				<LoadingFallback>
					<LoadingText>Loading...</LoadingText>
				</LoadingFallback>
			</LoadingWrapper>
		</InnerWidthWrapper>
	);
}
