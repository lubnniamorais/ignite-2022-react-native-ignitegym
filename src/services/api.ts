import axios from 'axios';

export const api = axios.create({
  // Aqui estamos definindo o endereço do servidor
  baseURL: 'http://192.168.100.53:3333',
});
