import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';


class ClientsListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: [],
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

    renderClients() {
        console.log(this.state.clients);
        return (
            this.state.clients.map((item, id) => {
                return(
                    <TouchableOpacity onPress={() => Alert.alert(item.name, item.description)} key={id} style={styles.client_view} >
                        <Text style={styles.client_item_name}>{item.name}</Text>
                        <View style={styles.btn_group_client}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Внести оплату', {client: item.id})} style={styles.btn_client} >
                                <Text style={styles.btn_text}>Доплатить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Отчёт', {id: item.id})} style={styles.btn_client} >
                                <Text style={styles.btn_text}>Отчёт</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    }
    render() {
        return (
            <View style={styles.containerList}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Добавить клиента')} style={styles.btn_group} >
                        <Text style={styles.btn_group_text}>{'Создать клиента'}</Text>
                    </TouchableOpacity>
                <ScrollView>
                    {this.renderClients()}
                </ScrollView>
            </View>
        )
    }
}

export default ClientsListScreen;