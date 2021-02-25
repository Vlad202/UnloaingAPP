import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';


class AddClientScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
        };  
    }

    async handleCreateClient() {
        if (this.state.name.length > 0 && this.state.description.length > 0) {
            await axios.post(`${URLS.cli}add/`, 
            {
                name: this.state.name,
                description: this.state.description,
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
                Alert.alert('Клиент создан!', 
                `Вы успешно создали клиента ${this.state.name}`,
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
            Alert.alert('Произошла ошибка', 'Введите все поля!')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput onChangeText={name => this.setState({name: name})} style={styles.input} placeholder='Имя клиента (компании)' />
                <TextInput onChangeText={description => this.setState({description: description})} style={styles.input} placeholder='Описание' />
                <TouchableOpacity onPress={this.handleCreateClient.bind(this)} style={styles.btn} >
                    <Text style={styles.btn_text}>Создать</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default AddClientScreen;