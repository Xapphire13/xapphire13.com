import * as React from 'react';
import { User } from './models/user';

type State = {
  user: User | null;
  isAuthorized: boolean;
};

// tslint:disable-next-line variable-name
export const UserContext = React.createContext<State>({
  user: null,
  isAuthorized: false
});
