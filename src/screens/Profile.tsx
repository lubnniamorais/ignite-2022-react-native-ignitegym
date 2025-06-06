import { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Center, Heading, Text, VStack } from '@gluestack-ui/themed';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '@hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { useToast } from 'native-base';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ToastMessage } from '@components/ToastMessage';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

type FormDataProps = {
  name: string;
  email: string;
  password: string | null;
  old_password: string | null;
  confirm_password: string | null;
};

// Para a validação da senha utilizamos o oneOf, onde a primeira posição do
// array é o valor do campo 'password' e a segunda posição é null, que é o valor padrão do
// campo 'confirm_password'.
const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().email('E-mail inválido').required('Informe o e-mail.'),
  old_password: yup.string().nullable(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .nullable()
    //
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (field: any) => field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    'https:github.com/lubnniamorais.png'
  );

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
      old_password: '',
      confirm_password: '',
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        // Hackzinho para apresentar o tamanho da imagem
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number;
        };

        // Validando se o tamanho da foto é maior que 5MB
        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 1) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action='error'
                title='Essa imagem é muito grande. Escolha uma de até 5MB.'
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        // Obtendo a extensão da imagem
        const fileExtension = photoURI.split('.').pop();

        // Usamos o nome do usuário para definir a imagem
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoURI,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();

        // O append() é para anexarmos as informações
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        // Pegando a nova foto do usuário do backend

        await updateUserProfile(userUpdated);
        // Setando a nova foto do usuário no contexto
        // e atualizando o estado global
        // do usuário logado

        toast.show({
          title: 'Foto atualizada com sucesso!',
          placement: 'top',
          bgColor: '$green.500',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;
      // Aqui estamos atualizando o nome do usuário

      await api.put('/users', data);

      await updateUserProfile(userUpdated);
      // Setando o novo usuário no contexto
      // e atualizando o estado global
      // do usuário logado

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: '$green500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o perfil. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: '$red500',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt='$6' px='$10'>
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaultUserPhotoImg
            }
            alt='Foto do usuário'
            size='xl'
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color='$green500'
              fontFamily='$heading'
              fontSize='$md'
              mt='$2'
              mb='$8'
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder='Nome'
                bg='$gray600'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder='E-mail'
                isReadOnly
                bg='$gray600'
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            alignSelf='flex-start'
            fontFamily='$heading'
            color='$gray200'
            fontSize='$md'
            mt='$12'
            mb='$2'
          >
            Alterar senha
          </Heading>

          <Center w='$full' gap='$4'>
            <Controller
              control={control}
              name='old_password'
              render={({ field: { onChange } }) => (
                <Input
                  placeholder='Senha antiga'
                  bg='$gray600'
                  secureTextEntry
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange } }) => (
                <Input
                  placeholder='Nova senha'
                  bg='$gray600'
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='confirm_password'
              render={({ field: { onChange } }) => (
                <Input
                  placeholder='Confirme a nova senha'
                  bg='$gray600'
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button
              title='Atualizar'
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
