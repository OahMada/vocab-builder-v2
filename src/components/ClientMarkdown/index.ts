'use client';

import dynamic from 'next/dynamic';

var ClientMarkdown = dynamic(() => import('./ClientMarkdown'));

export default ClientMarkdown;
