import { createContext, useState } from 'react';

import type { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => void;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);
// O AuthContext é um contexto que armazena informações de autenticação do usuário.
// Ele é criado usando a função createContext do React e é exportado para ser usado
// em outros componentes.

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
    id: '1',
    name: 'Lubnnia',
    email: 'lubnnia@example.com',
    avatar: 'lubnnia.png',
  });

  function signIn(email: string, password: string) {
    setUser({
      id: '',
      name: '',
      email,
      avatar: '',
    });
  }

  return (
    /* O value é o valor que queremos compartilhar no contexto, ou seja, 
        com toda a aplicação */
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
