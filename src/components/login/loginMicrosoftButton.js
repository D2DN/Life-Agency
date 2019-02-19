import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    NetInfo,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import isConnectedInternet from '../../utils/utils';

export default class LoginMicrosoftButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false
        }
        this.onClickBtnSingInWithMicrosoft = this.onClickBtnSingInWithMicrosoft.bind(this);
    }

    componentDidMount() {
        this.setState({isConnected: isConnectedInternet()});
    }

    onClickBtnSingInWithMicrosoft() {
        if (this.state.isConnected) {
            this.props.navigation.navigate('loginAzureAd', { isLogout: false });
        } else {
            Alert.alert("Oups", "Vous n'êtez pas connecté. S'il vous plaît vérifier votre connexion internet.");
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.btnLoginMs} onPress={this.onClickBtnSingInWithMicrosoft}>
                    <Text style={styles.labelBtnLoginMs}>
                        Se connecter
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

LoginMicrosoftButton.propTypes = {
    navigation: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
    btnLoginMs: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#2872dd',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
        flexDirection: 'row',
        marginBottom: 60,
    },
    iconBtnLoginMs: {
        width: 30,
        height: 30,
        padding: 10
    },
    labelBtnLoginMs: {
        padding: 0,
        marginLeft: 15,
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontFamily: 'SEGOEUI'
    },
});