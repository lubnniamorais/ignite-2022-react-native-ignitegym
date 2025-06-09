import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { AppError } from '@utils/AppError';
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken';

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  // Aqui estamos definindo o endereço do servidor
  baseURL: 'http://192.168.100.53:3333',
}) as APIInstanceProps;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

const failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

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

          // Aqui temos todas as configurações da requisição que foi feita
          const originalRequestConfig = requestError.config;

          // Verifica se tá acontecendo a solicitação de um novo token.
          // Dá primeira vez não irá entrar no IF, mas dá segunda requisição irá entrar.
          // Este é o fluxo de adicionar requisições na fila
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          // Buscando um novo token
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {
                refresh_token,
              });
              await storageAuthTokenSave({
                token: data.token,
                refresh_token: data.refresh_token,
              });
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
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
