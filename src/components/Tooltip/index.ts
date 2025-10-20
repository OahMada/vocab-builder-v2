'use client';

import dynamic from 'next/dynamic';

var TooltipProvider = dynamic(() => import('./Tooltip').then((mod) => mod.TooltipProvider));
var Tooltip = dynamic(() => import('./Tooltip'));

export { TooltipProvider };
export default Tooltip;
