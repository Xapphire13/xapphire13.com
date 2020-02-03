import React from 'react';
import { User } from './models/user';

type State = {
  user: User | null;
  isAuthorized: boolean;
};

const UserContext = React.createContext<State>({
  user: null,
  isAuthorized: false
});

export default UserContext;
