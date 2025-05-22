import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Box } from '@gluestack-ui/themed';

import { useAuth } from '@hooks/useAuth';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';
import { Loading } from '@components/Loading';

export function Routes() {
  // Através do useContext podemos acessar o contexto de autenticação, ou seja,
  // os dados do usuário logado e o token de autenticação.
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  if (isLoadingUserStorageData) {
    return <Loading />;
    // O isLoadingUserStorageData é um estado que indica se os dados do usuário
    // estão sendo carregados. Enquanto os dados estão sendo carregados, o
    // componente Loading é exibido. Quando os dados estão prontos, o componente
    // AuthRoutes ou AppRoutes é exibido, dependendo se o usuário está logado ou não.
  }

  return (
    // Essa box é para assegurar a cor de fundo da aplicação
    <Box flex={1} bg='$gray700'>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
