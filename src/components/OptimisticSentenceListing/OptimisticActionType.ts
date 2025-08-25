import { SentenceWithPieces } from '@/lib';

type OptimisticAction = { type: 'delete'; id: string } | { type: 'update'; data: SentenceWithPieces };

export default OptimisticAction;
