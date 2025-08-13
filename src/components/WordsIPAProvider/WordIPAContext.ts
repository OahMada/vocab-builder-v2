import * as React from 'react';
import { WordsIPAContextType } from './types';

var WordsIPAContext = React.createContext<WordsIPAContextType | null>(null);

export default WordsIPAContext;
