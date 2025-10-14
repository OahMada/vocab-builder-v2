'use client';

import dynamic from 'next/dynamic';

var Avatar = dynamic(() => import('./Avatar'));

export default Avatar;
