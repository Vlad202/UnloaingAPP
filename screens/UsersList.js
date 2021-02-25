import React, { useState } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';
import { DataTable } from 'react-native-paper';


class UsersScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };  
    }

    componentDidMount() {
        const { navigation } = this.props;
    
        this.focusListener = navigation.addListener('focus', () => {
            axios.get(`${URLS.auth}users/all/`, 
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
                this.setState({data: response.data});
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Произошла ошибка', 'Не удалось загрузить пользователей!');
            });
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener != null && this.focusListener.remove) {
            this.focusListener.remove();
        }
    }

    rowsData() {
        return (
            this.state.data.map((item, id) => {
                return (
                    <TouchableOpacity key={id} onPress={() => Alert.alert('Детали', `Тел/ник: ${item.username}\nИмя: ${item.first_name}\nФамилия: ${item.last_name}\nАдмин: ${item.is_superuser ? ('✔'):('❌')}\nE-mail: ${item.email}`)}>
                        <DataTable.Row>
                            <DataTable.Cell>{item.username}</DataTable.Cell>
                            <DataTable.Cell>{item.first_name}</DataTable.Cell>
                            <DataTable.Cell>{item.last_name}</DataTable.Cell>
                            <DataTable.Cell>{item.is_superuser ? ('✔'):('❌')}</DataTable.Cell>
                            <DataTable.Cell>{item.email}</DataTable.Cell>
                            <DataTable.Cell numeric><View style={{width: 25, height: 25, backgroundColor: item.color, borderRadius: 50}}></View></DataTable.Cell>
                        </DataTable.Row>
                    </TouchableOpacity>
                )
            })
        )
    }
    
    render() {
        const btn = (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Создать пользователя')} style={styles.btn_group} >
                <Text style={styles.btn_group_text}>Создать пользователя</Text>
            </TouchableOpacity>
        )
            return (
                this.state.data ? (
                    <View style={styles.containerList}>
                        {btn}
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>Тел./ник.</DataTable.Title>
                                    <DataTable.Title>Имя</DataTable.Title>
                                    <DataTable.Title>Фамилия</DataTable.Title>
                                    <DataTable.Title>Админ</DataTable.Title>
                                    <DataTable.Title>E-mail</DataTable.Title>
                                    <DataTable.Title>Цвет</DataTable.Title>
                                </DataTable.Header>
                                {this.rowsData()}
                            </DataTable>
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.containerList}>
                        {btn}
                        <View style={[styles.container, styles.horizontal]}>
                            <ActivityIndicator size="large" color="#45BA52" />
                        </View>
                    </View>
                )
            )
    }
}

export default UsersScreen;