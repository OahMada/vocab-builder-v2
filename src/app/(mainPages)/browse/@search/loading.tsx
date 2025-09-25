import * as React from 'react';

import { LoadingInnerWrapper, LoadingSpinner, LoadingWrapper } from '../StyledComponents';
import NoticeText from '@/components/BrowsePageNoticeText';

export default function Loading() {
	return (
		<LoadingWrapper>
			<NoticeText>Counting records...</NoticeText>
			<LoadingInnerWrapper>
				<LoadingSpinner description='Loading search result sentence list' size={25} />
			</LoadingInnerWrapper>
		</LoadingWrapper>
	);
}
