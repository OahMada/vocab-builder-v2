'use client';

import dynamic from 'next/dynamic';

var Toast = dynamic(() => import('./Toast'));
var ToastProvider = dynamic(() => import('./Toast').then((mod) => mod.ToastProvider));
var ToastViewport = dynamic(() => import('./Toast').then((mod) => mod.ToastViewport));

export default Toast;
export { ToastProvider, ToastViewport };
