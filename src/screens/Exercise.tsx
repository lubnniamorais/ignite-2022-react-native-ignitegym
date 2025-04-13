import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import type { AppNavigatorRoutesProps } from '@routes/app.routes';

import { VStack, Icon, HStack, Heading, Image } from '@gluestack-ui/themed';
import { ArrowLeft } from 'lucide-react-native';

import BodySvg from '@assets/body.svg';
import { Text } from '@gluestack-ui/themed';

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleGoBack() {
    navigation.goBack();
  }

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
            Puxada Frontal
          </Heading>

          <HStack alignItems='center'>
            <BodySvg />

            <Text color='$gray200' ml='$1' textTransform='capitalize'>
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <VStack p='$8'>
        <Image
          source={{
            uri: 'https://static.wixstatic.com/media/2edbed_756b0e7f28414ce9bb6795af1fc722b3~mv2.jpg/v1/fill/w_425,h_425,al_c,q_80,enc_avif,quality_auto/2edbed_756b0e7f28414ce9bb6795af1fc722b3~mv2.jpg',
          }}
          alt='Exercício'
          mb='$3'
          resizeMode='cover'
          rounded='$lg'
          w='$full'
          h='$80'
        />
      </VStack>
    </VStack>
  );
}
