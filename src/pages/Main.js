import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import superCoffee from '../assets/superCoffee.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {
  const id = navigation.getParam('id');
  const [users, setUsers] = useState([false]);
  const [matchDev, setMatchDev] = useState(null);
  const [avatar, setAvatar] = useState('0');

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });
      setUsers(response.data);
    }
    loadUsers();
  }, [id]);

  // ---------------------------------------

  useEffect(() => {
    const socket = io('http://192.168.0.127:3333', {
      query: { user: id },
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [id]);

  // ---------------------------------------

  useEffect(() => {
    async function getAvatar() {
      const userAvatar = await AsyncStorage.getItem('avatar');
      setAvatar(userAvatar);
    }
    getAvatar();
  }, [avatar]);

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id },
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id },
    });

    setUsers(rest);
  }

  async function handleLogout() {
    if (users.length === 0) {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <View>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.notDevs}>Não a mais Devs ;-( </Text>
          </View>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, { zIndex: users.length - index }]}
            >
              <Image style={styles.img} source={{ uri: user.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleDislike} style={styles.button}>
          <Image source={dislike} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCoffee}>
          <Image style={styles.coffee} source={superCoffee} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLike} style={styles.button}>
          <Image source={like} />
        </TouchableOpacity>
      </View>
      {matchDev && (
        <View style={styles.matchContainer}>
          <Image source={itsamatch} style={styles.itsamatch} />
          <Image source={{ uri: matchDev.avatar }} style={styles.avatar} />

          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity
            style={styles.matchButton}
            onPress={() => setMatchDev(null)}
          >
            <Text style={styles.closeMatch}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notDevs: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#150210',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  logo: {
    height: 50,
    width: 150,
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 25,
  },
  avatar: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    marginTop: 20,
    backgroundColor: '#99f3',
    borderColor: '#99f3',
    borderRadius: 100,
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 600,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#15020122',
    margin: 3,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  img: {
    flex: 1,
    height: 300,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 10,
  },
  name: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bio: {
    color: '#0016',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  coffee: {
    height: 60,
    width: 60,
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#99f3',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonCoffee: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#99f2',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#150210',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  matchName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  matchBio: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    padding: 10,
    textAlign: 'center',
  },
  matchButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(63, 10, 64, 0.4)',
  },
  closeMatch: {
    fontSize: 26,
    color: '#8299',
  },
});
