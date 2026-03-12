import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { LoginCredentials, LoginResult, UserBasic } from '@/types/user';
import { authService } from '@/services/auth-service';
import { ApiResult } from '@/types/api';

export type AuthContextType = {
  user: UserBasic | null;
  isReady: boolean;
  signIn: (credentials: LoginCredentials) => Promise<ApiResult<LoginResult>>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isReady: false,
  signIn: async () : Promise<ApiResult<LoginResult>> => {
    return null as unknown as ApiResult<LoginResult>;
  },
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserBasic | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    authService.restoreSession().then((session) => {
      if (session) setUser(session.user);
      setIsReady(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        signIn: async (credentials: LoginCredentials) : Promise<ApiResult<LoginResult>> => {
          const result = await authService.login(credentials);
          if (result.success) {
            setUser(result.data.user);
          }
          return result;
        },
        signOut: () => {
          authService.logout();
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
