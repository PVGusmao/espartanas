import React, {useEffect, useState} from 'react';
import {Checkbox, HStack, Input, Text, VStack} from 'native-base';
import {Header} from '../../components/molecule/Header.molecule';
import Screen from '../../components/molecule/Screen.molecule';
import Main from '../../components/molecule/Main.molecule';
import {Footer} from '../../components/atom/Footer.atom';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {RegisterFormData, RegisterSchema} from '../../utils/resolvers';
import Button from '../../components/molecule/Button.molecule';
import {maskDate, maskLetters, maskPhone} from '../../utils/masks';
import api from '../../services/api';

export function Register() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    length: '',
    lowercase: '',
    uppercase: '',
    number: '',
    symbol: '',
    confirmPassword: '',
  });

  const [terms, setTerms] = useState(false);

  const [privacy, setPrivacy] = useState(false);

  const validatePassword = () => {
    const newErrors = {
      length:
        password.length < 8 || password.length > 15
          ? 'Deve ter de 8 a 15 caracteres'
          : '',
      lowercase: !/[a-z]/.test(password)
        ? 'Deve ter pelo menos uma letra minúscula'
        : '',
      uppercase: !/[A-Z]/.test(password)
        ? 'Deve ter pelo menos uma letra maiúscula'
        : '',
      number: !/[0-9]/.test(password) ? 'Deve ter pelo menos um número' : '',
      symbol: !/[@!#%$]/.test(password)
        ? 'Deve ter pelo menos um caractere especial'
        : '',
    };

    setPasswordErrors(newErrors);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword();
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordErrors({
        ...passwordErrors,
        confirmPassword: 'As senhas devem ser iguais',
      });
    } else {
      setPasswordErrors({
        ...passwordErrors,
        confirmPassword: '',
      });
    }
  };

  const [error, _setError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    birthDate: '',
  });

  const {
    control,
    handleSubmit,
    formState: {
      errors: {firstName, lastName, email, phone, birthDate},
    },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const body = {
      ...data,
      password,
      member: false,
      acceptTerms: !handleDisableButton(),
    };

    api
      .post('/user', body)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  };

  function handleDisableButton() {
    if (!terms || !privacy) {
      return true;
    }

    return false;
  }

  useEffect(() => {
    validatePassword();
    handleConfirmPasswordChange(confirmPassword);
  }, [password, confirmPassword]);

  return (
    <Screen>
      <Header showArrowBack showTitle title="Cadastro" />

      <Main>
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              p={'5px'}
              mb="5px"
              borderWidth={0}
              borderBottomWidth={1}
              borderColor={'gray.600'}
              placeholder="Primeiro nome"
              onChangeText={text => onChange(maskLetters(text))}
              value={value}
              maxLength={12}
            />
          )}
          name="firstName"
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {firstName?.message || error?.firstName}
        </Text>

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              p={'5px'}
              mb="5px"
              borderWidth={0}
              borderBottomWidth={1}
              borderColor={'gray.600'}
              placeholder="Último nome"
              onChangeText={text => onChange(maskLetters(text))}
              value={value}
              maxLength={12}
            />
          )}
          name="lastName"
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {lastName?.message || error?.lastName}
        </Text>

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              p={'5px'}
              mb="5px"
              borderWidth={0}
              borderBottomWidth={1}
              borderColor={'gray.600'}
              placeholder="Telefone"
              onChangeText={text => onChange(maskPhone(text))}
              value={value}
              maxLength={15}
            />
          )}
          name="phone"
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {phone?.message || error?.phone}
        </Text>

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              p={'5px'}
              mb="5px"
              borderWidth={0}
              borderBottomWidth={1}
              borderColor={'gray.600'}
              placeholder="Data de nascimento"
              onChangeText={text => onChange(maskDate(text))}
              value={value}
              maxLength={10}
            />
          )}
          name="birthDate"
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {birthDate?.message || error?.birthDate}
        </Text>

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              p={'5px'}
              mb="5px"
              borderWidth={0}
              borderBottomWidth={1}
              borderColor={'gray.600'}
              placeholder="E-mail"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {email?.message || error?.email}
        </Text>

        <Input
          mb="5px"
          borderWidth={0}
          borderBottomWidth={1}
          borderColor={'gray.600'}
          placeholder="Senha"
          onChangeText={handlePasswordChange}
          value={password}
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {passwordErrors?.length ||
            passwordErrors?.lowercase ||
            passwordErrors?.number ||
            passwordErrors?.symbol ||
            passwordErrors?.uppercase}
        </Text>

        <Input
          mb="5px"
          borderWidth={0}
          borderBottomWidth={1}
          borderColor={'gray.600'}
          placeholder="Confirmar a senha"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />

        <Text mb={'10px'} bold fontSize={'12px'} color={'red.500'}>
          {passwordErrors?.confirmPassword}
        </Text>

        <VStack>
          <HStack mb={'10px'} alignItems={'center'}>
            <Checkbox
              onChange={check => setTerms(check)}
              mr={'5px'}
              value="1"
              accessibilityLabel="Checkbox"
              aria-label="Checkbox"
            />
            <Text>Concordo com os termos e serviços Espartanas.</Text>
          </HStack>

          <HStack mb={'10px'}>
            <Checkbox
              onChange={check => setPrivacy(check)}
              mr={'5px'}
              value="2"
              accessibilityLabel="Checkbox"
              aria-label="Checkbox"
            />
            <Text>
              Concordo com o processamento dos meus dados pessoais conforme
              descrito acima e melhor explicado na Política de Privacidade
            </Text>
          </HStack>
        </VStack>

        <Button
          variant={handleDisableButton() ? true : false}
          borderColorVariant={handleDisableButton() ? 'gray.600' : 'blue.800'}
          disabled={handleDisableButton()}
          onPress={handleSubmit(onSubmit)}
          text="Cadastrar"
        />
      </Main>

      <Footer />
    </Screen>
  );
}
