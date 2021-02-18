import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
            buttons: [
                {
                    text: 'Список клиентов',
                    screen_name: 'Клиенты',
                },
                {
                    text: 'Создать отгрузку',
                    screen_name: 'Добавить отгрузку',
                }
            ],
            data: [],
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
                let btns_response = this.state.buttons;
                btns_response.push({
                    text: 'Список пользователей',
                    screen_name: 'Список пользователей',
                });
                this.setState({buttons: btns_response});
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
                console.log(response.data);
            })
            .catch((error) => {
                Alert.alert('Произошла ошибка!', 'Не удалось загрузить список отгрузок.')
            }); 
        });
    }
    renderButtons() {
        return (
            this.state.buttons.map((item, id) => {
                return(
                    <TouchableOpacity key={id} onPress={() => this.props.navigation.navigate(item.screen_name)} style={styles.btn_group} >
                        <Text style={styles.btn_group_text}>{item.text}</Text>
                    </TouchableOpacity>
                )
            })
        )
    }

    rowsData() {
        return (
            this.state.data.map((item, id) => {
                return (
                    <TouchableOpacity key={id}>
                        <DataTable.Row>
                            <DataTable.Cell>{item.client}</DataTable.Cell>
                            <DataTable.Cell>{item.details}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.alredy_paid}</DataTable.Cell>
                        </DataTable.Row>
                    </TouchableOpacity>
                )
            })
        )
    }


    render() {
        return (
            <View style={styles.containerList}>
                <View style={styles.buttons}>
                    {this.renderButtons()}
                    <View style={styles.header_view}>
                        <Text style={styles.header}>Последние отгрузки</Text>
                    </View>
                </View>
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
        )
    }
}

export default MainScreen;