import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';
import { ColorPicker } from 'react-native-status-color-picker';



class CreateUsersScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            username: '',
            selectedColor: '#F44336',
            colors: ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B"],
        };  
    }

    async handleCreateClient() {
        if (this.state.username.length > 0 && this.state.password.length > 0) {
            await axios.post(`${URLS.auth}register/`, 
            {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
                color: this.state.selectedColor
            },
            {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Authorization': 'Token ' + SyncStorage.get('token')
                },
            })
            .then((response) => {
                console.log(response.data);
                Alert.alert('Клиент создан!', 
                `Вы успешно создали клиента ${this.state.username}`,
                [
                    {
                        text: 'Готово',
                        onPress: () => this.props.navigation.goBack()
                    },
                ]);           
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Произошла ошибка', 'Не удалось создать клиента!');
            });
        } else {
            Alert.alert('Произошла ошибка', 'Введите все поля! Обязательные поля: \n1. Номер телефона или никнейм \n2. Пароль.')
        }
    }

    onSelect = color => this.setState({ selectedColor: color });

    render() {
        return (
            <View style={styles.container}>
                <TextInput onChangeText={first_name => this.setState({first_name: first_name})} style={styles.input} placeholder='Имя' />
                <TextInput onChangeText={last_name => this.setState({last_name: last_name})} style={styles.input} placeholder='Фамилия' />
                <TextInput onChangeText={username => this.setState({username: username})} style={styles.input} placeholder='Номер телефона или никнейм' />
                <TextInput onChangeText={email => this.setState({email: email})} style={styles.input} placeholder='E-mail' />
                <TextInput onChangeText={password => this.setState({password: password})} style={styles.input} placeholder='Пароль' />
                <ColorPicker
                    colors={this.state.colors}
                    selectedColor={this.state.selectedColor}
                    onSelect={this.onSelect}
                />                
                <TouchableOpacity onPress={this.handleCreateClient.bind(this)} style={styles.btn} >
                    <Text style={styles.btn_text}>Создать</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default CreateUsersScreen;