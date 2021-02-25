import React, { useState } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import { DataTable } from 'react-native-paper';
import Dialog from "react-native-dialog";


class UnloadDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            visible: true,
        };  
    }



    render() {
        return (
            <Dialog.Container visible={this.props.visible}>
                <Dialog.Title>Детали</Dialog.Title>
                    {this.props.msg}
                <Dialog.Button label="Закрыть" onPress={this.props.handleCancel} />
            </Dialog.Container>
        )
    }
}

export default UnloadDialog;