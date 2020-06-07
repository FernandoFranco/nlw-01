import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, View, Image, Text, ImageBackground } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import PickerSelect, { Item as IPickerItem } from 'react-native-picker-select';

import ibge from '../../services/ibge';

interface IIBGEUF {
  id: number,
  sigla: string,
  nome: string,
}

interface IIBGECity {
  id: number,
  nome: string,
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUFs] = useState<Array<IPickerItem>>([]);
  const [cities, setCities] = useState<Array<IPickerItem>>([]);

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    ibge.get('/localidades/estados')
      .then(({ data }) => {
        setUFs(data.map((uf: IIBGEUF) => ({
          key: uf.id,
          label: uf.nome,
          value: uf.sigla,
        }) as IPickerItem));
      });
  }, []);

  useEffect(() => {
    ibge.get(`/localidades/estados/${selectedUF}/municipios`)
      .then(({ data }) => {
        setCities(data.map((city: IIBGECity) => ({
          key: city.id,
          label: city.nome,
          value: city.nome,
        }) as IPickerItem));
      });
  }, [selectedUF]);

  function handleNavigationToPoints() {
    navigation.navigate('Points', { uf: selectedUF, city: selectedCity });
  }

  function handleChangeUf(value: string) {
    setSelectedUF(value);
  }

  function handleChangeCity(value: string) {
    setSelectedCity(value);
  }

  return (
    <ImageBackground
      style={styles.container}
      imageStyle={{width: 274, height: 368}}
      source={require('../../assets/home-background.png')}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <PickerSelect
          placeholder={{ label: 'Selecione a UF' }}
          style={pickerStyles}
          items={ufs}
          value={selectedUF}
          onValueChange={handleChangeUf}
          useNativeAndroidPickerStyle={false}
        />

        <PickerSelect
          placeholder={{ label: 'Selecione a Cidade' }}
          style={pickerStyles}
          items={cities}
          value={selectedCity}
          onValueChange={handleChangeCity}
          useNativeAndroidPickerStyle={false}
        />

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" size={24} color="#FFF" />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const pickerStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
