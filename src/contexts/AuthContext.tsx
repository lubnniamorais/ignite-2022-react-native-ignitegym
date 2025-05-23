import { createContext, useEffect, useState } from 'react';

import { api } from '@services/api';

import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser';

import type { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
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
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      // O data é a resposta da requisição, que contém as informações do usuário
      // autenticado. O setUser é uma função que atualiza o estado do usuário
      // autenticado. O user é o estado que armazena as informações do usuário.
      if (data.user) {
        setUser(data.user);
        storageUserSave(data.user);
      }
    } catch (error) {
      throw error;
    }
  }

  // O signOut é uma função que desloga o usuário. Ela atualiza o estado do
  // usuário para um objeto vazio e remove as informações do usuário
  // armazenadas no AsyncStorage.
  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
      // O finally é um bloco que sempre será executado, independentemente
      // de o try ou o catch serem executados. Ele é usado para garantir
      // que o estado do carregamento seja atualizado corretamente.
      // Isso é importante para evitar que a aplicação fique travada
      // em um estado de carregamento infinito.
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();

      // Se o usuário estiver logado, atualiza o estado do usuário
      // com as informações armazenadas no AsyncStorage
      if (userLogged) {
        setUser(userLogged);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
    // O loadUserData é uma função que carrega as informações do usuário
  }, []);

  return (
    /* O value é o valor que queremos compartilhar no contexto, ou seja, 
        com toda a aplicação */
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoadingUserStorageData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
