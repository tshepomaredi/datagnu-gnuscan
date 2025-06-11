// contexts/UserContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
}

const UserContext = createContext<UserContextType>({ username: null });

export const UserProvider = ({ children, username }: { children: ReactNode; username: string | null }) => {
  return <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
