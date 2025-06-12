// contexts/UserContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
  email: string | null;
  userId: string | null;
}

const UserContext = createContext<UserContextType>({ 
  username: null,
  email: null,
  userId: null
});

export const UserProvider = ({ 
  children, 
  username, 
  email, 
  userId 
}: { 
  children: ReactNode; 
  username: string | null;
  email: string | null;
  userId: string | null;
}) => {
  return <UserContext.Provider value={{ username, email, userId }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
