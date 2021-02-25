import React, { useState } from 'react';
import { Text, View, StatusBar, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';
import { DataTable } from 'react-native-paper';


class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            btn_clients: false,
        };  
    }
    componentDidMount() {
        axios.get(`${URLS.auth}user/permission/`, {
            headers: {
                'Authorization': 'Token ' + SyncStorage.get('token')
            }
        })
        .then((response) => {
            if (response.data.is_superuser) {
                SyncStorage.set('is_superuser', response.data.is_superuser);
                this.setState({btn_clients: true});
            }
        })
        .catch((error) => {
            console.log(error);
        });   
        const { navigation } = this.props;
    
        this.focusListener = navigation.addListener('focus', () => {
            axios.get(`${URLS.cli}unloading/all/`, {
                headers: {
                    'Authorization': 'Token ' + SyncStorage.get('token')
                }
            })
            .then((response) => {
                this.setState({data: response.data});
            })
            .catch((error) => {
                Alert.alert('Произошла ошибка!', 'Не удалось загрузить список отгрузок.')
            }); 
        });
    }
    renderButtons() {
        if (this.state.btn_clients) {
            return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Список пользователей')} style={styles.btn_group} >
                        <Text style={styles.btn_group_text}>Список пользователей</Text>
                    </TouchableOpacity>
            )
        }
    }

    rowsData() {
        return (
            this.state.data.map((item, id) => {
                return (
                    <View key={id}>
                        <DataTable.Row>
                            <DataTable.Cell>{item.client}</DataTable.Cell>
                            <DataTable.Cell>{item.details}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.alredy_paid}</DataTable.Cell>
                        </DataTable.Row>
                    </View>
                )
            })
        )
    }


    render() {
        const buttons = (
            <View style={styles.buttons}>
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Клиенты')} style={styles.btn_group} >
                        <Text style={styles.btn_group_text}>Список клиентов</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Добавить отгрузку', {client: false })} style={styles.btn_group} >
                        <Text style={styles.btn_group_text}>Создать отгрузку</Text>
                    </TouchableOpacity>
                </View>
                {this.renderButtons()}
                <View style={styles.header_view}>
                    <Text style={styles.header}>Последние отгрузки</Text>
                </View>
            </View>
        )
        return (
            this.state.data ? (
                <View style={styles.containerList}>
                    {buttons}
                    <ScrollView>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Клиент</DataTable.Title>
                                <DataTable.Title>Детали</DataTable.Title>
                                <DataTable.Title numeric>Цена</DataTable.Title>
                                <DataTable.Title numeric>Внесено</DataTable.Title>
                            </DataTable.Header>
                            {this.rowsData()}
                        </DataTable>
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.containerList}>
                    {buttons}
                    <ActivityIndicator size="large" color="#45BA52" />
                </View>
            )
        )
    }
}

export default MainScreen;