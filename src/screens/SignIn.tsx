import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
} from '@gluestack-ui/themed';

import { useToast } from 'native-base';

import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { useNavigation } from '@react-navigation/native';

import type { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { useAuth } from '@hooks/useAuth';

import { AppError } from '@utils/AppError';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      // Caso o erro não seja uma instância de AppError, exibe uma mensagem padrão
      const title = isAppError
        ? error.message
        : 'Não foi possível acessar. Tente novamente mais tarde.';

      setIsLoading(false);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w='$full'
          h={624}
          source={BackgroundImg}
          alt='Pessoas treinando'
          defaultSource={BackgroundImg}
          position='absolute'
        />

        <VStack flex={1} px='$10' pb='$16'>
          <Center my='$24'>
            <Logo />

            <Text color='$gray100' fontSize='$sm'>
              Treine sua mente e o seu corpo.
            </Text>
          </Center>

          <Center gap='$2'>
            <Heading color='$gray100'>Acesse a conta</Heading>

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Senha'
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button
              title='Acessar'
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>

          <Center flex={1} justifyContent='flex-end' mt='$4'>
            <Text color='$gray100' fontSize='$sm' mb='$3' fontFamily='$bold'>
              Ainda não tem acesso?
            </Text>

            <Button
              title='Criar Conta'
              variant='outline'
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
