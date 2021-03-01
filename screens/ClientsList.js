import React, { useState } from 'react';
import { Text, View, StatusBar, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import DelayInput from "react-native-debounce-input";
import UnloadDialog from '../components/UnloadDetailsDialog';


class ClientsListScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.handleCancel = this.handleCancel.bind(this);
        // this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            clients: null,
            message: '',
            visible: false,
            msg: ''
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

    showDialog = () => {
        this.setState({visible: true});
    };
     
    handleCancel = () => {
        this.setState({visible: false});
    };
    handleDelete = () => {
        this.setState({visible: false});
    };
    handleAlertShowing = (msg, user_id) => {
        console.log(msg);
        // this.setState({msg: 'msg'});
        this.setState({user_id: user_id});
        this.setState({visible: true});
    }

    returnClient(item, id) {
        return(
            <TouchableOpacity onPress={() => this.handleAlertShowing(item.description, item.id)} key={id} style={styles.client_view} >
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
                    <UnloadDialog handleCancel={this.handleCancel} handleDelete={this.handleDelete} user_id={this.state.user_id} msg={this.state.msg} visible={this.state.visible} />
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