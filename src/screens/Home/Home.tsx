import React, {useState} from 'react';
import {useAuth} from '../../context/authContext';
import Screen from '../../components/molecule/Screen.molecule';
import {Pressable, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import {Dimensions} from 'react-native';
import Slide from '../../components/molecule/Home/Slide/Slide';
import {initialSlide} from '../../utils/initialSlide';
import {useApp} from '../../context/appContext';

export function Home() {
  const {user} = useAuth();
  const {userData, setUserData} = useApp();

  const navigation = useNavigation();

  const [category, setCategory] = useState(10);

  const buttonDisabled =
    category === 0 || category === 1 || category === 2 ? false : true;

  function goToPlanScreen() {
    setUserData({...userData, category});
    navigation.navigate('Plans' as never);
  }

  return (
    <Screen flex={1} bg={'white'} paddingX={'0px'}>
      <Text px={'20px'} mt={'20px'} fontSize={'18px'}>
        Bem vindo{' '}
        <Text bold>
          {user.firstName} {user.lastName}
        </Text>
        , escolha a categoria que melhor se aplica a você e pressione continuar
      </Text>

      <Carousel
        data={initialSlide}
        renderItem={item => (
          <Slide
            category={category}
            setCategory={setCategory}
            item={item.item}
          />
        )}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={280}
      />

      <Pressable
        disabled={buttonDisabled}
        mx={'20px'}
        mb={'40px'}
        alignItems={'center'}
        justifyContent={'center'}
        h={'60px'}
        mt={'20px'}
        bg={'blue.800'}
        borderRadius={'10px'}
        _pressed={{opacity: 0.5}}
        onPress={goToPlanScreen}>
        <Text fontSize={'20px'} color={'white'} bold>
          Seja uma espartana!
        </Text>
      </Pressable>
    </Screen>
  );
}
