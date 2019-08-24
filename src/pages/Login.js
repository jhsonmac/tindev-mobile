import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
// let's have a coffee
import logo from '../assets/logo.png';

export default function Login({ navigation }) {
  const [user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userID').then(id => {
      if (id) {
        navigation.navigate('Main', { id });
      }
    });
  }, [navigation]);

  async function handleLogin() {
    const response = await api.post('/devs', { username: user });
    const { _id: id, avatar: userAvatar } = response.data;
    await AsyncStorage.setItem('userID', id);
    await AsyncStorage.setItem('avatar', userAvatar);
    navigation.navigate('Main', { id });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}
    >
      <Image source={logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        placeholder="User GitGub"
        placeholderTextColor="#999"
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#150210',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  input: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    marginTop: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#F06C00',
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  button: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#F06C00',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
