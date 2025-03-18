import { Image, VStack } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/images/background.png';

export default function SignIn() {
  return (
    <VStack flex={1} bg='$gray700'>
      <Image
        w='$full'
        h={624}
        src={BackgroundImg}
        alt='Pessoas treinando'
        defaultSource={BackgroundImg}
        position='absolute'
      />
    </VStack>
  );
}
