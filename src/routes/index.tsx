import { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Box } from '@gluestack-ui/themed';

import { AuthContext } from '@contexts/AuthContext';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';

export function Routes() {
  // Através do useContext podemos acessar o contexto de autenticação, ou seja,
  // os dados do usuário logado e o token de autenticação.
  const contextData = useContext(AuthContext);
  console.log('Usuário logado: ', contextData);

  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  return (
    // Essa box é para assegurar a cor de fundo da aplicação
    <Box flex={1} bg='$gray700'>
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
