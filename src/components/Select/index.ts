'use client';

import dynamic from 'next/dynamic';

var Select = dynamic(() => import('./Select').then((mod) => mod.Select));
var SelectItem = dynamic(() => import('./Select').then((mod) => mod.SelectItem));

export { Select, SelectItem };
