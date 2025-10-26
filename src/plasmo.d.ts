/* eslint-disable @typescript-eslint/no-empty-object-type */

import '@plasmohq/messaging';

interface MmMetadata {
	sync: {};
}

interface MpMetadata {}

declare module '@plasmohq/messaging' {
	interface MessagesMetadata extends MmMetadata {}
	interface PortsMetadata extends MpMetadata {}
}
