import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import { StackNavigator } from 'react-navigation';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

import LifeAgencyApi from '../../api/LifeAgencyApi';

const api = new LifeAgencyApi();

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_Name: '',
            pass_word: '',
            user_group: ''
        }
        this.onClickBtnConnect = this.onClickBtnConnect.bind(this);
    }

    onClickBtnConnect() {
        const checkUserConnection = async () => {

            let resp = await api.login({
                userName: this.state.user_Name,
                password: this.state.pass_word,
            }).then(respJson => {
                if (respJson.hasOwnProperty('data')) {
                    this.setState({
                        user_group: respJson.data.group
                    });

                    AsyncStorage.setItem('userGroup', "grp-lifeagency-adm"); //this.state.user_group);
                    AsyncStorage.setItem('userName', this.state.user_Name);
                    this.sendToken();
                    this.props.navigation.navigate('home');
                } else {
                    //TODO HANDLE ERRORS alert(r.error.message);
                    Alert.alert('Oups','Vérifier votre nom d\'utilisateur et/ou mot de passe');
                }
            }).catch(error => {
                Alert.alert("Erreur réseau",error.message);
            });
        };
        checkUserConnection();
    }

    sendToken() {
        FCM.getFCMToken()
            .then(toKen => {
                api.saveTokenAfterLogin(token)
                    .then(t => console.log(t))
                    .catch(error => console.log('error save token'));
             }).catch(error => console.log(JSON.stringify(error)));
    }

    render() {

        return (
            <View style={styles.container}>
                <View>
                    <TextInput placeholder="User Name"
                        style={styles.input}
                        returnKeyType="next"
                        //clearTextOnFocus= 'true'
                        keyboardType="email-address"
                        autoCorrect={false}
                        //autoFocus= "true"
                        autoCapitalize="none"
                        onSubmitEditing={() => this.passwordInput.focus()}
                        placeholderTextColor="gray"
                        onChangeText={(name) => { this.setState({ user_Name: name }); }}>
                    </TextInput>
                    <TextInput placeholder="Password"
                        placeholderTextColor="gray"
                        returnKeyType="go"
                        clearTextOnFocus={true}
                        style={styles.input}
                        onChangeText={(pass) => { this.setState({ pass_word: pass }); }}
                        ref={(input) => this.passwordInput = input}
                        secureTextEntry>
                    </TextInput>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={this.onClickBtnConnect}>
                        <Text style={styles.buttontext}>
                            Se Connecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

LoginForm.propTypes = {
    navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    buttonContainer: {

        backgroundColor: '#2980b9',
        paddingVertical: 10,
        marginHorizontal: 10

    },
    buttontext: {
      textAlign: 'center',
      fontSize: 30,
      fontFamily: LifeAgencyApi.getFontTitle(),
      color: '#FFFFFF',
      fontWeight: '700'
    },
    input: {
      borderColor: '#2980b9',
      fontSize: 20,
      fontFamily: LifeAgencyApi.getFontTitle(),
      backgroundColor:'white',
      borderWidth: 2,
      height: 40,
      margin: 10,
      alignItems: 'center',
      width:320,
      paddingHorizontal: 10,
    }
});
/* user_Name: 'user-read1',
            pass_word: '!L@-read', */
