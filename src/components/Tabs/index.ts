'use client';

import dynamic from 'next/dynamic';

var TabsRoot = dynamic(() => import('./Tabs').then((mod) => mod.TabsRoot));
var TabsList = dynamic(() => import('./Tabs').then((mod) => mod.TabsList));
var TabsTrigger = dynamic(() => import('./Tabs').then((mod) => mod.TabsTrigger));
var TabsContent = dynamic(() => import('./Tabs').then((mod) => mod.TabsContent));

export { TabsContent, TabsTrigger, TabsList, TabsRoot };
