import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';


class PayForInloadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alredy_paid: 0,
        };  
    }
    isNumber(n) {
        return Number(n) == n;
    }
    handleUpdateUnloading() {
        const client_id = this.props.route.params.client;
        if (this.state.alredy_paid !== 0 && this.isNumber(this.state.alredy_paid) && client_id) {
            axios.post(`${URLS.cli}unloading/update/`, 
            {
                client: client_id,
                alredy_paid: this.state.alredy_paid
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
                Alert.alert('Отгрузка обновлена!', 
                `Вы успешно внесли сумму ${this.state.alredy_paid}`,
                [
                    {
                        text: 'Готово',
                        onPress: () => this.props.navigation.goBack()
                    },
                ]); 
            })
            .catch((error) => {
                console.log(error.message);
                Alert.alert('Произошла ошибка', 'Не удалось обновить доплату!');
            });
        } else {
            Alert.alert('Произошла ошибка', 'Введите поля правильно!');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput onChangeText={alredy_paid => this.setState({alredy_paid: alredy_paid})} style={styles.input} placeholder='Клиент внёс:' />
                <TouchableOpacity onPress={() => this.handleUpdateUnloading()} style={styles.btn} >
                    <Text style={styles.btn_text}>Отправить</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default PayForInloadingScreen;