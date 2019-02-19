import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ReactNativeAD, ADLoginView, Logger } from 'react-native-azure-ad';
import LoginUser from './loginUser';
import LifeAgencyApi from '../../api/LifeAgencyApi';
import Home from '../home/home'
import APP_CONFIG from '../../config/config';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';


const api = new LifeAgencyApi();

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'loginScreen' })
    ]
});

export default class LoginAzureAd extends React.Component {

    constructor(props) {
        super(props)
        new ReactNativeAD(APP_CONFIG.azureApp);
    }

    render() {
        return (
            <View style={styles.container}>
                <ADLoginView context={ReactNativeAD.getContext(APP_CONFIG.azureApp.client_id)}
                    needLogout={this.props.navigation.state.params.isLogout}
                    hideAfterLogin={true}
                    onSuccess={this.onLoginSuccess.bind(this)}
                    onURLChange={this.onUrlChange.bind(this)}
                />
            </View>
        );
    }

    onUrlChange(e) {
        let isLoginPage = e.url === `${APP_CONFIG.azureApp.authorityHost}?response_type=code&client_id=${APP_CONFIG.azureApp.client_id}`;

        if (isLoginPage && !e.loading && this.props.navigation.state.params.isLogout) {
            this.logoutUser();
        }
    }

    logoutUser() {
        api.logout().then(res => {
            AsyncStorage.removeItem(APP_CONFIG.token).then(resp => {
                this.props.navigation.dispatch(resetAction);                
            });
        }).catch(error => {
            console.error(JSON.stringify(error));
        });
    }

    sendToken() {
        FCM.getFCMToken()
            .then(toKen => {
                api.saveTokenAfterLogin(token)
                    .then(t => console.log(t))
                    .catch(error => console.log('error save token'));
             }).catch(error => console.log(JSON.stringify(error)));
    }

    onLoginSuccess(cred) {
        ReactNativeAD
            .getContext(APP_CONFIG.azureApp.client_id)
            .assureToken(APP_CONFIG.azureApp.resources[0])
            .then(token => {
                if (token == 'undefined') {
                    this.props.navigation.navigate('loginScreen');
                } else {
                    LoginUser.loginUserAfterAuth(token)
                        .then(() => this.props.navigation.navigate('home'));
                        this.sendToken();
                }
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});