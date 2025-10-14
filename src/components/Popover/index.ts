'use client';

import dynamic from 'next/dynamic';

var Popover = dynamic(() => import('./Popover').then((mod) => mod.Popover));
var PopoverContent = dynamic(() => import('./Popover').then((mod) => mod.PopoverContent));
var PopoverTrigger = dynamic(() => import('./Popover').then((mod) => mod.PopoverTrigger));

export { Popover, PopoverContent, PopoverTrigger };
