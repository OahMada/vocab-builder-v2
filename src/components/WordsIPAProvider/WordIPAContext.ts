import * as React from 'react';
import { WordsIPAContextType } from './type';

var WordsIPAContext = React.createContext<WordsIPAContextType | null>(null);

export default WordsIPAContext;
