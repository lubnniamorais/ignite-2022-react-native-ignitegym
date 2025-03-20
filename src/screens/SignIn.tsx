import { Center, Heading, Image, Text, VStack } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/images/background.png';

import Logo from '@assets/images/logo.svg';
import { Input } from '@components/Input';

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

      <VStack flex={1} px='$10' pb='$16'>
        <Center my='$24'>
          <Logo />

          <Text color='$gray100' fontSize='$sm'>
            Treine sua mente e o seu corpo.
          </Text>
        </Center>

        <Center gap='$2'>
          <Heading color='$gray100'>Acesse a conta</Heading>

          <Input placeholder='E-mail' />
          <Input placeholder='Senha' />
        </Center>
      </VStack>
    </VStack>
  );
}
