import axios, { type AxiosInstance } from 'axios';

import { AppError } from '@utils/AppError';
import { storageAuthTokenGet } from '@storage/storageAuthToken';

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  // Aqui estamos definindo o endereço do servidor
  baseURL: 'http://192.168.100.53:3333',
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      // Se o status é 401, significa que temos uma requisição não autorizada
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === 'token.expired' ||
          requestError.response.data?.message === 'token.invalid'
        ) {
          const { refresh_token } = await storageAuthTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }
        }

        // Se não é token expirado ou token inválido, então vamos deslogar
        signOut();
      }
      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(
          new AppError('Erro no servidor. Tente novamente mais tarde.')
        );
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
    // Aqui estamos removendo o interceptor
  };
};

export { api };
