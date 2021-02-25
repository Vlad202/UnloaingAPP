import React, { useState } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import { DataTable } from 'react-native-paper';
import Dialog from "react-native-dialog";
import UnloadDialog from '../components/UnloadDetailsDialog';

class ClientsDetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            data: undefined,
            visible: false,
        };  
    }
    async componentDidMount() {
        // console.log(`${URLS.cli}unloading/list/${this.props.route.params.id}/`);
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

    showDialog = () => {
        this.setState({visible: true});
    };
     
    handleCancel = () => {
        this.setState({visible: false});
    };

    handleAlertShowing = (msg) => {
        this.setState({msg: msg});
        this.setState({visible: true});
    }

    rowsData() {
        return (
            this.state.data.map((item, id) => {
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
                        <TouchableOpacity key={id} onPress={() => this.handleAlertShowing(msg)}>
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
                        <UnloadDialog handleCancel={this.handleCancel} msg={this.state.msg} visible={this.state.visible} />
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