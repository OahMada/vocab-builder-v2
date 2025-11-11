'use client';
import { LayoutGroup, LazyMotion } from 'motion/react';

var loadFeatures = () => import('@/lib/motionDomMax').then((res) => res.default);

function MotionLoader({ children }: { children: React.ReactNode }) {
	return (
		<LazyMotion features={loadFeatures}>
			<LayoutGroup>{children}</LayoutGroup>
		</LazyMotion>
	);
}

export default MotionLoader;
