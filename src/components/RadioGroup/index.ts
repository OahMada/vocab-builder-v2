'use client';

import dynamic from 'next/dynamic';

var RadioGroup = dynamic(() => import('./RadioGroup').then((mod) => mod.RadioGroup));
var RadioGroupItem = dynamic(() => import('./RadioGroup').then((mod) => mod.RadioGroupItem));

export { RadioGroup, RadioGroupItem };
