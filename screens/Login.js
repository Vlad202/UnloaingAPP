import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';


function LoginScreen(props) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        if (login.length > 0 && password.length > 0) {
            await axios.post(`${URLS.auth}auth/`, 
            {
                username: login,
                password: password,
            },
            {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
            })
            .then((response) => {
                if (response.status == 200) {
                    const token = response.data.token;
                    SyncStorage.set('token', token);
                    SyncStorage.set('username', login);
                    return props.navigation.dispatch(StackActions.replace('Главная'));
                }            })
            .catch((error) => {
                if (error) {
                    console.log(error.message)
                    Alert.alert('Не удалось войти!', 'Неверный логин или пароль!');
                }
            });
        } else {
            Alert.alert('Не удалось войти!', 'Введите логин и пароль!');
        }
    }
    return (
        <View style={styles.container}>
            <TextInput onChangeText={(login) => setLogin(login)} style={styles.input} placeholder='Логин' />
            <TextInput onChangeText={(pass) => setPassword(pass)} style={styles.input} placeholder='Пароль' />
            <TouchableOpacity onPress={handleLogin} style={styles.btn} >
                <Text style={styles.btn_text}>Войти</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen;