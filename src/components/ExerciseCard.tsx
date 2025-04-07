import {
  HStack,
  Image,
  VStack,
  Heading,
  Text,
  Icon,
} from '@gluestack-ui/themed';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

type Props = TouchableOpacityProps;

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg='$gray500'
        alignItems='center'
        p='$2'
        pr='$4'
        rounded='$md'
        mb='$3'
      >
        <Image
          source={{
            uri: 'https://static.wixstatic.com/media/2edbed_756b0e7f28414ce9bb6795af1fc722b3~mv2.jpg/v1/fill/w_425,h_425,al_c,q_80,enc_avif,quality_auto/2edbed_756b0e7f28414ce9bb6795af1fc722b3~mv2.jpg',
          }}
          alt='Imagem do exercício'
          w='$16'
          h='$16'
          rounded='$md'
          mr='$4'
          resizeMode='cover'
        />

        <VStack flex={1}>
          <Heading fontSize='$lg' color='$white' fontFamily='$heading'>
            Puxada frontal
          </Heading>

          <Text fontSize='$sm' color='$gray200' mt='$1' numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color='$gray300' />
      </HStack>
    </TouchableOpacity>
  );
}
