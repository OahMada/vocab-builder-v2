import * as React from 'react';
import styled from 'styled-components';

import { QUERIES } from '@/constants';

export default function AnswerBox({ children, ref, ...delegated }: { children: React.ReactNode } & React.ComponentProps<'div'>) {
	let wrapperRef = React.useRef<null | HTMLDivElement>(null);

	React.useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => wrapperRef.current);

	// show the box bottom every time the modal opens
	React.useEffect(() => {
		let element = wrapperRef.current;
		if (!element) return;
		element.scrollTo({
			top: element.scrollHeight,
		});
	}, []);

	return (
		<Wrapper ref={wrapperRef} {...delegated}>
			{children}
		</Wrapper>
	);
}

var Wrapper = styled.div`
	padding: 16px;
	padding-right: 10px;
	height: 100%;
	overflow: auto;
	scrollbar-gutter: stable;

	@media ${QUERIES.laptopAndUp} {
		// to compensate for the scroll gutter
		padding-right: 6px;
	}

	& > * {
		margin-bottom: 10px;
	}
`;
