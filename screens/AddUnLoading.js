import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { Picker } from '@react-native-community/picker';
import styles from '../styles';
import axios from 'axios';
import URLS from '../settings';
import SyncStorage from 'sync-storage';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'

class AddUnLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            data: [],
            client: undefined,
            details: '',
            price: undefined,
            alredy_paid: undefined,
            loaded: false,
            selectedTeam: {},
            selectedTeams: [],
        };  
    }

    async componentDidMount() {
        await axios.get(`${URLS.cli}all/`, 
        {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Token ' + SyncStorage.get('token')
            },
        })
        .then((response) => {
            this.setState({data: response.data});
            this.setState({client: this.state.data[0].id})
        })
        .catch((error) => {
            Alert.alert('Произошла ошибка', 'Не удалось загрузить клиентов!');
        });
        await axios.get(`${URLS.auth}users/all/`, 
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
            let users = [];
            response.data.forEach((item) => {
                users.push({
                    id: item.id,
                    item: item.first_name + ' ' + item.last_name + ' ' + item.username
                })
            });
            this.setState({users_data: users});
            this.setState({loaded: true});
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('Произошла ошибка', 'Не удалось загрузить пользователей!');
        });
    }

    isNumber(n) {
        return Number(n) == n;
    }

    async handleOnLoading() {
        console.log('IS NUMBER: ' + this.isNumber(this.state.price) + ' ' + this.state.price);
        if (this.state.client && this.isNumber(this.state.price) && this.isNumber(this.state.alredy_paid) && this.state.selectedTeams.length) {
            let users_to_send = [];
            this.state.selectedTeams.forEach(item => {
                users_to_send.push(item.id);
            });
            await axios.post(`${URLS.cli}unloading/add/`, 
            {
                client: this.state.client,
                price: this.state.price,
                alredy_paid: this.state.alredy_paid,
                details: this.state.details,
                workers: users_to_send,
            },
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
                Alert.alert('Отгрузка создана!', 
                `Вы успешно создали отгрузки на сумму ${this.state.price}`,
                [
                    {
                        text: 'Готово',
                        onPress: () => this.props.navigation.goBack()
                    },
                ]);           
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Произошла ошибка', 'Не удалось создать отгрузку!');
            });
        } else {
            Alert.alert('Произошла ошибка', 'Введите поля корректно!')
        }
    }

    handlePicker() {
        return (
            this.state.data.map((item, id) => {
                return (
                    <Picker.Item key={id} label={item.name} value={item.id} />
                )
            })
        )
    }

    onMultiChange() {
        return (item) => this.setState({selectedTeams: xorBy(this.state.selectedTeams, [item], 'id')})
    }
    
    onChange() {
        return (val) => this.setState({selectedTeam: val});
    }

    render() {

        return (
            this.state.loaded ? (
                <View style={styles.container}>
                    <TextInput onChangeText={details => this.setState({details: details})} style={styles.input} placeholder='Детали отгрузки' />
                    <TextInput onChangeText={price => this.setState({price: price})} style={styles.input} placeholder='Цена отгрузки' />
                    <TextInput onChangeText={alredy_paid => this.setState({alredy_paid: alredy_paid})} style={styles.input} placeholder='Заплачено' />
                    <SelectBox
                        label="Выбрать пользователей"
                        inputPlaceholder="Введите пользователя"
                        options={this.state.users_data}
                        selectedValues={this.state.selectedTeams}
                        onMultiSelect={this.onMultiChange()}
                        onTapClose={this.onMultiChange()}
                        isMulti={true}
                        arrowIconColor='#45BA52'
                        searchIconColor='#45BA52'
                        toggleIconColor='#45BA52'
                        multiOptionContainerStyle={{
                            backgroundColor: '#45BA52'
                        }}
                        width={300}
                    />
                    <View style={styles.clientsPickerContainer}>
                        <Text style={styles.clientsPickerText}>Выберите клиента</Text>
                        <Picker
                            selectedValue={this.state.client}
                            style={{ height: 50, width: 300 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({client: itemValue})}
                        >
                            {this.handlePicker()}
                        </Picker>
                    </View>
                    <TouchableOpacity onPress={this.handleOnLoading.bind(this)} style={styles.btn} >
                        <Text style={styles.btn_text}>Создать</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#45BA52" />
                    <StatusBar barStyle="default" />
                </View>
            )
        )
    }
}

export default AddUnLoadingScreen;