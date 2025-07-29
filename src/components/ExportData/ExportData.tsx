'use client';

import * as React from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function ExportData() {
	return (
		<Button variant='outline'>
			<Icon id='export' />
			&nbsp; Export Data
		</Button>
	);
}

export default ExportData;
