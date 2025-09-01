import * as React from 'react';
import { GlobalToastContextType } from './types';

var GlobalToastContext = React.createContext<GlobalToastContextType | null>(null);

export default GlobalToastContext;
