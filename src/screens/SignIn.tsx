import { Center, Image, Text, VStack } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/images/background.png';

import Logo from '@assets/images/logo.svg';

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

      <Center my='$24'>
        <Logo />

        <Text color='$gray100' fontSize='$sm'>
          Treine sua mente e o seu corpo.
        </Text>
      </Center>
    </VStack>
  );
}
