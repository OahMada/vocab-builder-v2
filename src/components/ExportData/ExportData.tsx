'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function ExportData() {
	return (
		<ExportButton variant='outline'>
			<Icon id='export' />
			&nbsp; Export Sentences
		</ExportButton>
	);
}

export default ExportData;

var ExportButton = styled(Button)`
	font-size: 1.2rem;
`;
