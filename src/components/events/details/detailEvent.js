import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, AsyncStorage, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Timestamp from 'react-timestamp';
import Dimensions from 'Dimensions';
import Toast from 'react-native-root-toast';
import DatePicker from 'react-native-datepicker';
import PropTypes from 'prop-types';

import updateEvent from '../details/updateEvent'
import LifeAgencyApi from '../../../api/LifeAgencyApi';
import APP_CONFIG from '../../../config/config';
import Moment from 'moment';

const api = new LifeAgencyApi();
Moment.locale('en');

/* This component allows to display the event detail*/
export default class DetailEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data,
      titleEvent: this.props.navigation.state.params.title,
      descriptionEVent: this.props.navigation.state.params.data.description,
      date: this.props.navigation.state.params.date.split(' ')[0],
      time: this.props.navigation.state.params.date.split(' ')[1],
      showButton: false
    }
  }

  componentWillMount() {
    const getStoredToken = async () => {
      let token = await AsyncStorage.getItem(APP_CONFIG.token);
      this.setState({
        token: token
      });
    }
    
    getStoredToken();
    this.checkIfUserCanEditEvent();
  }

  /* Option of the page */
  static navigationOptions = {
    title: "Detail Event",
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: LifeAgencyApi.getColorSiiBlue(),
      height: 40,
    },
    headerTitleStyle: {
      fontSize: 25, 
      fontFamily: LifeAgencyApi.getFontHeader(),
      color: 'white',
    }
  }

  /* Function who allows to know the user group: admin, reader or writer
  If user group is : admin or write then we displays the button to update the event */
  async checkIfUserCanEditEvent() {
    let user = await AsyncStorage.getItem('user', (err, user) => {
      user = JSON.parse(user);

      for(let i = 0; i < user.groups.length; i++) {           
        if (user.groups[i] === APP_CONFIG.admGroup) {
          this.setState({
            showButton: true
          });
          return;
        }
      }
    });
  }

  /* Function who allows to display an information message on the screen 
  for indicate to user if the update is OK or KO */
  toastCtrl(message) {
    Toast.show(message, {
      duration: 1500,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  }

  /* Function who allows to delete an event in DB by this id */
  async deleteEvent(id) {
    try {
      let responseJson = await api.deleteEvent(id);
      return responseJson.data;
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const data = this.props.navigation.state.params.data;
    const title = this.props.navigation.state.params.title;
    const date = this.props.navigation.state.params.date;
    const sourceImage = this.props.navigation.state.params.imageSource;
    const description = this.props.navigation.state.params.description;

    return (
      <ScrollView style={styles.container}>

        <Text style={stylesDetailEvent.when}>
              {Moment(date).format('MMM DD, YYYY - hh:mm')}
        </Text>

        {/* Display the name of the event*/}
        <Text style={stylesDetailEvent.title}>{title}</Text>

        {/* Display the image of the event*/}
        <View style={stylesDetailEvent.image}>
          <Image style={stylesDetailEvent.eventIcon} 
            source={{ uri: sourceImage, headers: {Authorization: this.state.token}}}>
          </Image>
        </View>


        <Text style={stylesDetailEvent.description}>{description}</Text>

        {/*If the user is admin or writer then the button upadte and delete are display on the screen*/}
        {this.state.showButton &&
          <View style={{margin: 20 }}>

            <Button
              icon={{ name: 'update' }}
              backgroundColor={LifeAgencyApi.getColorSiiBlue()}
              buttonStyle={stylesDetailEvent.button}
              onPress={() =>
                this.props.navigation.navigate('updateEvent', {
                  date,
                  title,
                  description,
                  data,
                  sourceImage
                })}
              title='Mettre a jour' />
            <Button
              icon={{ name: 'delete' }}
              backgroundColor='red'
              buttonStyle={stylesDetailEvent.button}
              onPress={() => {
                Alert.alert(
                  'Demande de confirmation',
                  'Êtes-vous sur de vouloir supprimer l\'événement ?',
                  [

                    { text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                      text: 'OK', onPress: () => {
                        this.deleteEvent(data.id).then(() => {
                          this.toastCtrl('Événement supprimé avec succès');
                          this.props.navigation.navigate('list');
                        })
                      }
                    },
                  ],
                  { cancelable: false }
                )
              }}

              title='Supprimer' />
          </View>}

      </ScrollView>
    );
  }
}

DetailEvent.propTypes = {
  navigation: PropTypes.object.isRequired
}

const stylesDetailEvent = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  image: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  eventIcon: {
    marginRight: 0,
    borderRadius: 80,
    height: 150,
    width: 150
  },
  title: {
    fontFamily: LifeAgencyApi.getFontTitle(),
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20,
    textAlign: 'left'
  },
  description: {
    fontFamily: LifeAgencyApi.getFontSubTitle(),
    textAlign: 'justify',
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    padding: 10
  },
  when: {
    fontFamily: LifeAgencyApi.getFontTitle(),
    fontSize: 18,
    marginLeft: 20,
    marginTop: 20,
    position: 'relative',
  },
  button: {
    margin: 10,
    borderRadius: 100,
  },
});
