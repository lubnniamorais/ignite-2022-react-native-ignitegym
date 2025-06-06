import { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useToast } from 'native-base';

import type { AppNavigatorRoutesProps } from '@routes/app.routes';

import { VStack, Icon, HStack, Heading, Box } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { Text } from '@gluestack-ui/themed';

import { api } from '@services/api';

import type { ExerciseDTO } from '@dtos/ExerciseDTO';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionSvg from '@assets/repetitions.svg';

import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const { exerciseId } = route.params as RouteParamsProps;

  const toast = useToast();

  // Aqui você pode usar o exerciseId para buscar detalhes do exercício
  // Exemplo: useEffect(() => { fetchExerciseDetails(exerciseId); }, [exerciseId]);

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    // Função para buscar detalhes do exercício usando o exerciseId
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercícios.';

      toast.show({
        title,
        placement: 'top',
        bg: '$red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Nessa função, estamos registrando o exercício no histórico. Pegamos o ID do exercício
  // que foi passado como parâmetro na rota e fazemos uma requisição POST para a API.
  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);

      await api.post('/history/', { exercise_id: exerciseId });
      // console.log('resposta', response.data);

      // console.log('Aqui');

      // toast.show({
      //   title: 'Parabéns! Exercício registrado no seu histórico.',
      //   placement: 'top',
      //   bg: '$green.500',
      // });

      navigation.navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível registrar o exercício.';

      toast.show({
        title,
        placement: 'top',
        bg: '$red.500',
      });
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);
  // A dependência exerciseId garante que a função seja chamada sempre que o ID do exercício
  // mudar.
  // Isso é útil se você estiver navegando para diferentes exercícios na mesma tela.

  return (
    <VStack flex={1}>
      <VStack px='$8' bg='$gray600' pt='$12'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color='$green500' size='xl' />
        </TouchableOpacity>

        <HStack
          justifyContent='space-between'
          alignItems='center'
          mt='$4'
          mb='$8'
        >
          <Heading color='$gray100' fontFamily='$heading' fontSize='$lg'>
            {exercise.name}
          </Heading>

          <HStack alignItems='center'>
            <BodySvg />

            <Text color='$gray200' ml='$1' textTransform='capitalize'>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <VStack p='$8'>
            <Box rounded='lg' mb={3} overflow='hidden'>
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt='Exercício'
                contentFit='cover'
                style={{ width: '100%', height: 320, borderRadius: 8 }}
              />
            </Box>

            <Box bg='$gray600' rounded='$md' pb='$4' px='$4'>
              <HStack
                alignItems='center'
                justifyContent='space-around'
                mb='$6'
                mt='$5'
              >
                <HStack>
                  <SeriesSvg />
                  <Text color='$gray200' ml='$2'>
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionSvg />
                  <Text color='$gray200' ml='$2'>
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title='Marcar como realizado'
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
