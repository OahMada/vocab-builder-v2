'use client';

import * as React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

function ClientMarkdown({ children }: { children: string }) {
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={{
				table: (props) => (
					<TableWrapper>
						<table {...props} />
					</TableWrapper>
				),
			}}
		>
			{children}
		</Markdown>
	);
}

export default ClientMarkdown;

var TableWrapper = styled.div`
	overflow-x: auto;
	margin: 10px 0;
`;
