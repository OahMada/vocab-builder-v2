'use client';

import dynamic from 'next/dynamic';

var DropdownMenu = dynamic(() => import('./DropDownMenu').then((mod) => mod.DropdownMenu));
var DropdownMenuContent = dynamic(() => import('./DropDownMenu').then((mod) => mod.DropdownMenuContent));
var DropdownMenuItem = dynamic(() => import('./DropDownMenu').then((mod) => mod.DropdownMenuItem));
var DropdownMenuTrigger = dynamic(() => import('./DropDownMenu').then((mod) => mod.DropdownMenuTrigger));
var MobileDropdownMenuItem = dynamic(() => import('./DropDownMenu').then((mod) => mod.MobileDropdownMenuItem));

export { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, MobileDropdownMenuItem };
