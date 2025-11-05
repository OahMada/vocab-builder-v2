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
						<Table {...props} />
					</TableWrapper>
				),
				ul: (props) => <Ul {...props} />,
				ol: (props) => <Ol {...props} />,
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
	width: 100%;
`;

var Table = styled.table`
	border-spacing: 0;
	width: max-content;
	max-width: 200%;
	th,
	td {
		border-bottom: 1px solid var(--border);
		padding: 0.5rem;
	}
`;

var Ul = styled.ul`
	padding-left: 15px;
`;

var Ol = styled.ol`
	padding-left: 15px;
`;
