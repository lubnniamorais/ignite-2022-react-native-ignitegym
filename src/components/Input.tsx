import type { ComponentProps } from 'react';

import {
  Input as GluestackInput,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@gluestack-ui/themed';

type Props = ComponentProps<typeof InputField> & {
  errorMessage?: string | null;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};

export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: Props) {
  // As duas exclamações fazem com que o valor seja convertido em booleano.
  // Aqui estamos verificando se há uma mensagem de erro ou se o campo é inválido.
  // Poderemos usar a constante invalid para apresentar uma mensagem de erro ou dizer
  // se o campo é inválido.
  const invalid = !!errorMessage || isInvalid;

  // O FormControl é para controlar o input.

  return (
    <FormControl isInvalid={invalid} mb='$4' w='$full'>
      <GluestackInput
        isInvalid={isInvalid}
        h='$14'
        borderWidth='$0'
        borderRadius='$md'
        $invalid={{
          borderWidth: 1,
          borderColor: '$red500',
        }}
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? '$red500' : '$green500',
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          px='$4'
          bg='$gray700'
          color='$white'
          fontFamily='$body'
          placeholderTextColor='$gray300'
          {...rest}
        />
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color='$red500'>
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
