'use client';

import dynamic from 'next/dynamic';

var AlertDialog = dynamic(() => import('./AlertDialog'));

export default AlertDialog;
