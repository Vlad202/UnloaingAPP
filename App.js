import React, {useState} from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/Login';
import MainScreen from './screens/Main';
import ClientsListScreen from './screens/ClientsList';
import ClientsDetailsScreen from './screens/ClientDetails';
import AddClientScreen from './screens/AddClient';
import AddUnLoadingScreen from './screens/AddUnLoading';
import CreateUsersScreen from './screens/Users';
import UsersScreen from './screens/UsersList';
import PayForInloadingScreen from './screens/PayForInloading';

import Header from './components/Header';

import SyncStorage from 'sync-storage';
import styles from './styles';

let Stack = createStackNavigator();
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_controller: null,
      token: null,
      loading: false,
    };  
}
  async componentDidMount() {
    const data = await SyncStorage.init();
    this.setState({token: SyncStorage.get('token')});
    const main_screen = <Stack.Screen name="Главная" 
      options={{
        header: props => <Header title='Главная' {...props} />,
      }}
      component={MainScreen} 
    />
    if (!this.state.token) {
      this.setState({login_controller: [<Stack.Screen name="Вход" component={LoginScreen} />, 
      main_screen]});
    } else {
      this.setState({login_controller: [main_screen, <Stack.Screen name="Вход" component={LoginScreen} />]});
    }
    console.log(this.state.token);
    this.setState({loading: true});
  }
  render() {
    return(
      this.state.loading ? (
        <NavigationContainer>
          <Stack.Navigator>
            {this.state.login_controller}
            <Stack.Screen name="Клиенты" component={ClientsListScreen} />
            <Stack.Screen name="Отчёт" component={ClientsDetailsScreen} />
            <Stack.Screen name="Добавить клиента" component={AddClientScreen} />
            <Stack.Screen name="Добавить отгрузку" component={AddUnLoadingScreen} />
            <Stack.Screen name="Список пользователей" component={UsersScreen} />
            <Stack.Screen name="Создать пользователя" component={CreateUsersScreen} />
            <Stack.Screen name="Внести оплату" component={PayForInloadingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#45BA52" />
          <StatusBar barStyle="default" />
        </View>
      )
    )
  }
}
