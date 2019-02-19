import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {View, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';

import LifeAgencyApi from '../../api/LifeAgencyApi';
import Login from  '../login/login';

export default class Home extends Component {

  constructor(props) {
      super(props);
  }

  static navigationOptions = { title: 'Home', header: null};
  
  onCLickBntLogout(){
    Alert.alert(
        '',
        'Êtes-vous sur de vouloir vous déconnecter ?',
        [
          { text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => { 
            this.props.navigation.navigate('loginAzureAd', {isLogout: true});}},
        ],
        { cancelable: false }
      )
}

  render() {
    const { navigate } = this.props.navigation;

    return (
        <View style={stylesHome.container}>
           <TouchableOpacity activeOpacity={0.8} style={stylesHome.buttonEvent} onPress={() => navigate('list')}>
             <Text style={stylesHome.textButtonEvent}>Event</Text>
           </TouchableOpacity>   
           
           <TouchableOpacity activeOpacity={0.8} style={stylesHome.buttonDeconnexion}  onPress={this.onCLickBntLogout.bind(this)}>
                <Text style={stylesHome.textButtonDeconnexion}>Déconnexion</Text>
            </TouchableOpacity>
        </View>
    )
  }
}

Home.propTypes = {
    navigation: PropTypes.object.isRequired
}

const stylesHome = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    buttonEvent: {
        flex: 1,
        backgroundColor: LifeAgencyApi.getColorSiiBlue(),
        justifyContent: 'center',
    },
    textButtonEvent: {
        fontSize: 60,
        color: 'white',
        fontFamily: LifeAgencyApi.getFontHeader(),
        textAlign: 'center',   
    },
    buttonDeconnexion: {
        flex:1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    textButtonDeconnexion: {
        fontSize:60,
        fontFamily: LifeAgencyApi.getFontHeader(),
        textAlign: 'center',
    },
});