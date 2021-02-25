import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
        };  
    }

    logOut() {
        SyncStorage.remove('username');
        SyncStorage.remove('token');
        SyncStorage.remove('is_superuser');
        return this.props.navigation.dispatch(StackActions.replace('Вход'));
    }

    render() {
        return (
            <View style={styles.container_header}>
                <Text style={styles.header_title}>{this.props.title}</Text>
                <TouchableOpacity onPress={() => this.logOut()} style={styles.btn_logout} >
                    <Text style={styles.btn_group_text}>Выйти</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Header;