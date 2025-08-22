import * as React from 'react';
import { WordsContextType } from './types';

var WordsContext = React.createContext<WordsContextType | null>(null);

export default WordsContext;
