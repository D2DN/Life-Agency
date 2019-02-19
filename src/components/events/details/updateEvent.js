import React, { Component } from 'react'
import { Text, TextInput, View, StyleSheet, Alert,TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native'
import { Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import PropTypes from 'prop-types'
import Dimensions from 'Dimensions';
import DatePicker from 'react-native-datepicker';

import LifeAgencyApi from '../../../api/LifeAgencyApi';

const api = new LifeAgencyApi();

/* This component allows to udpate an Event*/
export default class UpdateEvent extends Component {
  static propTypes = {
    prop: PropTypes
  }
  /* Option of the page */
  static navigationOptions = {
    title: 'Mise à jour',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: LifeAgencyApi.getColorSiiBlue(),
      height: 40,
    },
    headerTitleStyle: {
      fontSize: 40,
      fontFamily: LifeAgencyApi.getFontHeader(),
      color: 'white',
    }
  }
  constructor(props){
      super(props);
      this.state = {
        userGroup: '',
        data: this.props.navigation.state.params.data,
        titleEvent: this.props.navigation.state.params.title,
        descriptionEVent: this.props.navigation.state.params.description,
        date: this.props.navigation.state.params.date.split(' ')[0],
        time: this.props.navigation.state.params.date.split(' ')[1],
        Image: this.props.navigation.state.params.sourceImage,
      }
  }

    /* Function who allows to update an event in the DB*/
    async upDateEvent() {
        try {
          let responseJson = await api.updateEvent({
            id: this.state.data.id,
            title: this.state.titleEvent,
            description: this.state.descriptionEVent,
            date: this.state.date.trimRight() + 'T' + this.state.time,
            eventType: {
              id: this.state.data.eventType.id
            }
          });
          return responseJson;
        } catch (error) {
          console.error(error);
        }
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

  render() {

    const { goBack } = this.props.navigation;

    return (
        
      <ScrollView style={styles.container}>

        {/*Text input to modify the event title*/}
        <TextInput value={this.state.titleEvent}
              style={stylesUpdateEvent.titleInput}
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize="none"
              underlineColorAndroid='transparent'              
              onSubmitEditing={() => this.passwordInput.focus()}
              placeholderTextColor="gray"
              onChangeText={(name) => {
                this.setState({
                  titleEvent: name,
                })
              }}
        />

        {/*Text input to modify the event description*/}
        <TextInput value={this.state.descriptionEVent}
        style={stylesUpdateEvent.descriptionInput}
        autoCorrect={false}
        multiline={true}
        autoCapitalize="none"
        underlineColorAndroid='transparent'        
        onSubmitEditing={() => this.passwordInput.focus()}
        placeholderTextColor="gray"
        onChangeText={(description) => {
            this.setState({
            descriptionEVent: description,
            })
        }}
        />

        {/*View who contain the pikers for date and time*/}
        <View style={stylesUpdateEvent.pickerView}>

            {/*Picker for the date*/}
            <DatePicker
                style={stylesUpdateEvent.datePicker}
                date={this.state.date}
                mode="date"
                placeholder="date"
                format="YYYY-MM-DD "
                maxDate="2020-08-04"
                confirmBtnText="OK"
                cancelBtnText="Annuler"
                customStyles={{
                    dateIcon: {
                        width: 0,
                        height: 0,
                    },
                    dateInput: {
                        borderColor: LifeAgencyApi.getColorSiiBlue(),
                        borderWidth: 2,
                    }
                }}
                onDateChange={(date) => {
                    this.setState({ date: date })
                    console.log(date)
                }}
                />

                {/*Picker for the time*/}
                <DatePicker
                    style={stylesUpdateEvent.timePicker}
                    date={this.state.time}
                    mode="time"
                    placeholder="heure"
                    format="HH:mm"
                    customStyles={{
                        dateInput: {
                            borderColor: LifeAgencyApi.getColorSiiBlue(),
                            borderWidth: 2,
                        }
                    }}
                    confirmBtnText="OK"
                    cancelBtnText="Annuler"
                    showIcon={false}
                    onDateChange={(time) => {
                        this.setState({ time: time })
                        console.log(time)
                        }}
                />
        </View>

            {/* Button for the update*/}
            <Button
                icon={{ name: 'update' }}
                backgroundColor={LifeAgencyApi.getColorSiiBlue()}
                buttonStyle={stylesUpdateEvent.button}
                onPress={() => {
                    Alert.alert(
                        '',
                        'Êtes-vous sur de vouloir apporter des modifications à l\'événement ?',
                        [
                        {
                        text: 'Annuler les modifications', onPress: () => this.setState({
                        update: false
                    })
                    },
                    {
                    text: 'Sauvegarder', onPress: () => {
                        this.upDateEvent().then(() => {
                        this.toastCtrl('Mise a jour effectuée avec succès');
                        this.props.navigation.navigate('list');
                        })
                    }
                    },
                ],
                { cancelable: false }
                )
                }}
                title='Mettre a jour'
            />
        </ScrollView>
   
    )}
}


UpdateEvent.propTypes = {
    navigation: PropTypes.object.isRequired
  }

const stylesUpdateEvent = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    titleInput: {
        flex: 1,
        fontFamily: LifeAgencyApi.getFontTitle(),
        borderColor: LifeAgencyApi.getColorSiiBlue(),
        borderWidth: 2,
        paddingLeft: 5, 
        minHeight:40,       
        margin: 20
    },
    descriptionInput: {
        textAlignVertical: "top",
        flex: 7,
        fontFamily: LifeAgencyApi.getFontSubTitle(),
        fontSize: 16,
        borderColor: LifeAgencyApi.getColorSiiBlue(),
        borderWidth: 2,
        paddingLeft: 5,
        margin: 20,
        minHeight: 160, // delete for landspace          
    },
    pickerView: {
        flex: 1,
        flexDirection: 'row',
        margin: 20,
    },
    datePicker: {
        flex: 3,
    },
    timePicker: { 
        flex: 1, 
    },
    button: {
        borderRadius: 100,
        marginBottom: 30,
      },
});