'use client';

import * as React from 'react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

function ExportData() {
	function handleExport() {
		window.location.href = '/api/download';
	}
	return (
		<Button variant='outline' onClick={handleExport}>
			<Icon id='export' />
			&nbsp; Export Data
		</Button>
	);
}

export default ExportData;
