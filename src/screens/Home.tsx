import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { VStack, HStack, Heading, Text } from '@gluestack-ui/themed';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import type { ExerciseDTO } from '@dtos/ExerciseDTO';

import { useToast } from 'native-base';

import type { AppNavigatorRoutesProps } from '@routes/app.routes';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { ExerciseCard } from '@components/ExerciseCard';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

export function Home() {
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('Costas');

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise');
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.';

      toast.show({
        title,
        placement: 'top',
        bg: '$red.500',
      });
    }
  }

  async function fetchExercisesByGroup() {
    try {
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios.';

      toast.show({
        title,
        placement: 'top',
        bg: '$red.500',
      });
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  // Toda vez que o grupo selecionado mudar, vamos buscar os exercícios desse grupo
  // e atualizar o estado de exercises.
  // useFocusEffect é usado para garantir que a função seja chamada quando a tela estiver em foco.
  // Isso é útil para evitar chamadas desnecessárias quando a tela não está visível.
  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 32,
        }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      <VStack px='$8' flex={1}>
        <HStack justifyContent='space-between' mb='$5' alignItems='center'>
          <Heading color='$gray200' fontSize='$md' fontFamily='$heading'>
            Exercícios
          </Heading>

          <Text color='$gray200' fontSize='$sm' fontFamily='$body'>
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} data={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}
