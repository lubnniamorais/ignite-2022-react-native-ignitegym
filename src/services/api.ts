import axios from 'axios';

import { AppError } from '@utils/AppError';

const api = axios.create({
  // Aqui estamos definindo o endereço do servidor
  baseURL: 'http://192.168.100.53:3333',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return Promise.reject(
        new AppError('Erro no servidor. Tente novamente mais tarde.')
      );
    }
  }
);

export { api };
