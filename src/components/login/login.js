import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image, Platform,
    KeyboardAvoidingView,
    Dimensions,
    AsyncStorage
} from 'react-native';
import PropTypes from 'prop-types';
import { StackNavigator } from 'react-navigation';

import LoginForm from './loginForm';
import LoginMicrosoftButton from './loginMicrosoftButton';
import LifeAgencyApi from '../../api/LifeAgencyApi';

import APP_CONFIG from '../../config/config';
import LoginUser from './loginUser';
import { ReactNativeAD } from 'react-native-azure-ad';

export default class Login extends React.Component {

    static navigationOptions = {
        title: 'Login',
        header: null,
    };

    constructor(props) {
        super(props);
        new ReactNativeAD(APP_CONFIG.azureApp);
    }

    componentWillMount() {
        AsyncStorage.getItem(APP_CONFIG.token).then(storedToken => {
            if (storedToken != null) {
                ReactNativeAD
                    .getContext(APP_CONFIG.azureApp.client_id)
                    .assureToken(APP_CONFIG.azureApp.resources[0])
                    .then(token => {
                        if (token == 'undefined') {
                            this.props.navigation.navigate('loginScreen');
                        } else {
                            LoginUser.loginUserAfterAuth(token)
                                .then(() => this.props.navigation.navigate('eventList'));
                        }
                    });
            }
        });
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../../img/favicon/LogoLifeAgency.png')} style={styles.logo}></Image>
                </View>
                <View style={styles.formContainer}>
                    <LoginMicrosoftButton navigation={this.props.navigation} />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

Login.propTypes = {
    navigation: PropTypes.object.isRequired
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 2,
        paddingTop: 20,
        justifyContent: 'center'
    },
    formContainer: {
        margin:5,
        marginBottom:5,
        alignItems: 'center',
    },
    logo: {
        paddingRight: 5,
        width: 300,
        height: 300,
    },
});
