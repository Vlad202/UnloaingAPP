import React, { useState } from 'react';
import { Text, View, StatusBar, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import DelayInput from "react-native-debounce-input";


class ClientsListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: null,
            message: ''
        };  
    }
    componentDidMount() {  
        const { navigation } = this.props;
    
        this.focusListener = navigation.addListener('focus', () => {
            axios.get(`${URLS.cli}all/`, {
                headers: {
                    'Authorization': 'Token ' + SyncStorage.get('token')
                }
            })
            .then((response) => {
                this.setState({clients: response.data});
            })
            .catch((error) => {
                console.log(error);
            }); 
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener != null && this.focusListener.remove) {
            this.focusListener.remove();
        }
    }

    returnClient(item, id) {
        return(
            <TouchableOpacity onPress={() => Alert.alert(item.name, item.description)} key={id} style={styles.client_view} >
                <View style={styles.client_name_view}>
                    <Text style={styles.client_item_name}>{item.name}</Text>
                </View>
                <View style={styles.btn_group_client}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Добавить отгрузку', {client: item.id, })} style={styles.btn_client} >
                        <Text style={styles.btn_client_text}>Отгрузка</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Внести оплату', {client: item.id})} style={styles.btn_client} >
                        <Text style={styles.btn_client_text}>Доплатить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Отчёт', {id: item.id})} style={styles.btn_client} >
                        <Text style={styles.btn_client_text}>Отчёт</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    renderClients() {
        console.log(this.state.clients);
        if (!this.state.message.length) {
            return (
                this.state.clients.map((item, id) => {
                    return this.returnClient(item, id)
                })
            )
        } else {
            return (
                this.state.clients.map((item, id) => {
                    if (item.name.toLowerCase().includes(this.state.message.toLowerCase())) {
                        return this.returnClient(item, id);
                    }
                })
            )
        }
    }
    render() {
        const btn = (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Добавить клиента')} style={styles.btn_group} >
                <Text style={styles.btn_group_text}>{'Создать клиента'}</Text>
            </TouchableOpacity>
        )
        return (
            this.state.clients ? (
                <View style={styles.containerList}>
                    {btn}
                    <DelayInput
                        minLength={0}
                        onChangeText={(msg) => this.setState({message: msg})}
                        delayTimeout={50}
                        style={styles.input}
                        placeholder={'Найти клиента'}
                    />
                    <ScrollView>
                        {this.renderClients()}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.containerList}>
                    {btn}
                    <ActivityIndicator size="large" color="#45BA52" />
                </View>
            )
        )
    }
}

export default ClientsListScreen;