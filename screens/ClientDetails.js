import React, { useState } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import { DataTable } from 'react-native-paper';
import UnloadDialog from '../components/UnloadDetailsDialog';


class ClientsDetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            data: undefined,
            visible: false,
        };  
    }
    async getListHandler() {
        await axios.get(`${URLS.cli}unloading/list/${this.props.route.params.id}/`, {
            headers: {
                'Authorization': 'Token ' + SyncStorage.get('token')
            }
        })
        .then((response) => {
            this.setState({data: response.data});
        })
        .catch((error) => {
            console.log(error);
        }); 
    }
    async componentDidMount() {
        // console.log(`${URLS.cli}unloading/list/${this.props.route.params.id}/`);
        await this.getListHandler();  
    }

    showDialog = () => {
        this.setState({visible: true});
    };
     
    handleCancel = () => {
        this.setState({visible: false});
    };

    async deleteUnloading() {
        await axios.get(`${URLS.cli}unloading/${this.state.user_id}/delete/`, {
            headers: {
                'Authorization': 'Token ' + SyncStorage.get('token')
            }
        })
        .then((response) => {
            Alert.alert('Отгрузка удалена!', 
            `Вы успешно удалили отгрузку`,
            [
                {
                    text: 'Готово',
                    onPress: () => this.getListHandler()
                },
            ]);
        })
        .catch((error) => {
            Alert.alert('Произошла ошибка', 'Не удалось создать отгрузку!');
        });   
    }
    
    handleDelete = () => {
        this.setState({visible: false});
        Alert.alert('Вы уверены?', `Вы пытаетесь удалить отгрузку id${this.state.user_id}.`,
        [
            {
              text: "Закрыть",
              style: "cancel"
            },
            { text: "Удалить", onPress: () => this.deleteUnloading() }
          ]
        )
    }

    handleAlertShowing = (msg, user_id) => {
        this.setState({msg: msg});
        this.setState({user_id: user_id});
        this.setState({visible: true});
    }

    rowsData() {
        return (
            this.state.data.map((item, id) => {
                let user_id = item.id;
                let msg = 
                <View>
                    <Text>{`Детали: ${item.details}\n\nОтгружали:`}</Text>
                    {
                        item.workers.map((i) => {
                            return (
                                <View>
                                    <View style={{width: 25, height: 25, backgroundColor: i.color, borderRadius: 50}}></View>
                                    <Text>Имя: {i.first_name}</Text>
                                    <Text>Фамилия: {i.last_name}</Text>
                                    <Text>Тел./ник.: {i.username}</Text>
                                </View>
                            )
                        })
                    }
                </View>;
                return (
                    <View>
                        <TouchableOpacity key={id} onPress={() => this.handleAlertShowing(msg, user_id)}>
                            <DataTable.Row>
                                <DataTable.Cell>{item.date}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.alredy_paid}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.debt}</DataTable.Cell>
                            </DataTable.Row>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
    }

    render() {
        if (this.state.data) {
            return (
                <View style={styles.containerList}>
                    <ScrollView>
                        {/* <Dialog.Container visible={this.state.visible}>
                            <Dialog.Title>Детали</Dialog.Title>
                            {this.state.msg}
                            <Dialog.Button label="Закрыть" onPress={this.handleCancel} />
                        </Dialog.Container> */}
                        <UnloadDialog handleCancel={this.handleCancel} handleDelete={this.handleDelete} user_id={this.state.user_id} msg={this.state.msg} visible={this.state.visible} />
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Дата</DataTable.Title>
                                <DataTable.Title numeric>Цена</DataTable.Title>
                                <DataTable.Title numeric>Внесено</DataTable.Title>
                                <DataTable.Title numeric>Долг</DataTable.Title>
                            </DataTable.Header>
                            {this.rowsData()}
                        </DataTable>
                    </ScrollView>
                </View>
            )
        }
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        )
    }
}

export default ClientsDetailsScreen;