import { StatusBar } from 'react-native';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { GluestackUIProvider } from '@gluestack-ui/themed';

import { config } from './config/gluestack-ui.config';

import { AuthContext } from '@contexts/AuthContext';

import { Loading } from '@components/Loading';

import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      {/* O value é o valor que queremos compartilhar no contexto, ou seja, 
      com toda a aplicação */}
      <AuthContext.Provider
        value={{
          id: '1',
          name: 'Lubnnia',
          email: 'lubnnia@example.com',
          avatar: 'lubnnia.png',
        }}
      >
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContext.Provider>
    </GluestackUIProvider>
  );
}
