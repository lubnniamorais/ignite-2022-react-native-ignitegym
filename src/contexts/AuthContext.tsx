import { createContext, useEffect, useState } from 'react';

import { api } from '@services/api';

import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from '@storage/storageAuthToken';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser';

import type { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
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

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    // O api é uma instância do Axios, que é uma biblioteca para fazer requisições HTTP.
    // O defaults.headers.common['Authorization'] é um cabeçalho que
    // é enviado em todas as requisições. O Bearer ${token} é um padrão de autenticação
    // que usa um token de autenticação. O token é uma string que identifica o usuário
    // e permite que ele acesse recursos protegidos.
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refresh_token: string
  ) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });
      // O storageUserAndTokenSave é uma função que armazena as informações
      // do usuário e o token de autenticação no AsyncStorage. O AsyncStorage
      // é uma biblioteca que permite armazenar dados de forma persistente
      // no dispositivo do usuário.
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      // O data é a resposta da requisição, que contém as informações do usuário
      // autenticado. O setUser é uma função que atualiza o estado do usuário
      // autenticado. O user é o estado que armazena as informações do usuário.

      const { data } = await api.post('/sessions', { email, password });

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(
          data.user,
          data.token,
          data.refresh_token
        );

        userAndTokenUpdate(data.user, data.token);
        // O storageUserAndToken é uma função que armazena as informações
        // do usuário e o token de autenticação no AsyncStorage. O AsyncStorage
        // é uma biblioteca que permite armazenar dados de forma persistente
        // no dispositivo do usuário.
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
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
      await storageAuthTokenRemove();
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

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
      // O updateUserProfile é uma função que atualiza as informações do usuário
      // no estado e as armazena no AsyncStorage.
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      // Se o usuário estiver logado, atualiza o estado do usuário
      // com as informações armazenadas no AsyncStorage
      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
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

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    /* O value é o valor que queremos compartilhar no contexto, ou seja, 
        com toda a aplicação */
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUserProfile,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
