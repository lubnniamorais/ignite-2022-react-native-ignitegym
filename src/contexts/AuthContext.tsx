import { createContext } from 'react';

import type { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
  user: UserDTO;
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
  return (
    /* O value é o valor que queremos compartilhar no contexto, ou seja, 
        com toda a aplicação */
    <AuthContext.Provider
      value={{
        user: {
          id: '1',
          name: 'Lubnnia',
          email: 'lubnnia@example.com',
          avatar: 'lubnnia.png',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
