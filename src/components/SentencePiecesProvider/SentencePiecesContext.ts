import * as React from 'react';
import { SentencePiecesContextType } from './types';

var SentencePiecesContext = React.createContext<SentencePiecesContextType | null>(null);

export default SentencePiecesContext;
