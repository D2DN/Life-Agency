import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Picker, TouchableOpacity, ScrollView } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Dimensions from 'Dimensions';
import Toast from 'react-native-root-toast';

import LifeAgencyApi from '../../../api/LifeAgencyApi';
import LifeAgency from '../../../../App';

const api = new LifeAgencyApi();

/* Component who allows to add an Event to the DB.
This component it is only display if the user is an administrator
*/
export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EventTypes: [],
      selectedEventType: '',
      selectedIdEventType: '',
      date: '',
      time: '',
      title: '',
      description: '',
    }
    this.getInitialState();
  }

    /* Option of the page */
 static navigationOptions = ({ navigation }) => ({
  title: "Ajout Event",
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: LifeAgencyApi.getColorSiiBlue(),
    height: 40,
  },  
  headerTitleStyle: {
    fontSize: 25,
    fontFamily: LifeAgencyApi.getFontHeader(),
    color: 'white',
  },
});

  getInitialState() {
    var event_Types = []
    this.getEventTypes().then(res => {
      res.map(item => {
        var typeEvent = {};
        typeEvent.id = item.id
        typeEvent.name = item.name
        event_Types.push(typeEvent)
      })

      this.setState({
        EventTypes: event_Types,
        selectedEventType: event_Types[0].name,
        selectedIdEventType: event_Types[0].id
      })
    })
  }
  
  /* Function for recovery all the eventTypes from the MongoDB*/
  async getEventTypes() {

    try {
      let responseJson = await api.getAllEventTypes();
      return responseJson.data;
    } catch (error) {
      console.error(error);
    }
  }
  /*Function for take a picture who will be used for the banner of the event.
  takePicture(){
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }*/

  /*Function who allows to display an pop-up with a information message*/
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

  /*Function who allows to check if all the informations for the event is present
  If it is not present, a pop-up is display on the screen*/
  _AddEvent() {

    if (this.state.title !== '' && this.state.title !== null) {
      if (this.state.description !== '' && this.state.description !== null) {
        if (this.state.selectedIdEventType !== '' && this.state.selectedIdEventType !== null) {
          if (this.state.date !== '' && this.state.date !== null) {
            this.saveEvent();
          } else { this.toastCtrl("Vérifier la date") }
        } else { this.toastCtrl("Vérifier le type d'évenement") }
      } else { this.toastCtrl("Le champs description est obligatoire") }
    } else { this.toastCtrl("Le champs titre est obligatoire") }
  }

  /*Function who allows to save the event in the MongoDB*/
  async saveEvent() {
    let responseJson = await api.addEvent({
      title: this.state.title,
      description: this.state.description,
      date: this.state.date.trimRight() + 'T' + this.state.time + ':00',
      eventType: {
        id: this.state.selectedIdEventType
      }
    }).then(res => {
      if (res.hasOwnProperty('data')) {
        this.toastCtrl("L'événement a été crée avec succès")
        this.props.navigation.navigate('list');
      } else {
        this.toastCtrl("L'ajout de l'événement a échoué");
      }
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    let eventTypesItem = this.state.EventTypes.map((s, i) => {
      return <Picker.Item key={i} value={s.id} label={s.name} />
    })

    return (
      <ScrollView style={styles.container}>

        {/* Input for the event title*/}
        <TextInput style={styleAddEvent.inputName}
          placeholder="Nom de l'Event"
          underlineColorAndroid='transparent'          
          onChangeText={(title) => { this.setState({ title: title }); }} />

        {/* Input for the event description*/}
        <TextInput style={styleAddEvent.inputDescription}
          placeholder="Description"
          multiline={true}
          underlineColorAndroid='transparent'
          onChangeText={(description) => { this.setState({ description: description }); }} />

        {/* View for the pikers: event type*/}
        <View style={styleAddEvent.pickerView}>

          <Text style={styleAddEvent.textPicker}> Type </Text>

          {/* Picker who display all the events type possible*/}
          <Picker
            style={styleAddEvent.pickerEventTypes}
            itemStyle={{ height: 45 }}
            selectedValue={this.state.selectedIdEventType}
            onValueChange={(typeEvet) => (this.setState({ selectedIdEventType: typeEvet }))}>
            {eventTypesItem}
          </Picker>

        </View>

        {/* View for the pikers: date and time*/}
        <View style={styleAddEvent.pickerView}>
          
          {/* Date picker*/}
          <DatePicker style={styleAddEvent.datePicker}
            date={this.state.date}
            mode="date"
            placeholder="date"
            format="YYYY-MM-DD "
            maxDate="2020-08-04"
            confirmBtnText="OK"
            cancelBtnText="Annuler"
            showIcon= {false}
            onDateChange={(date) => {
              this.setState({ date: date })
              console.log(date)
            }} />
          
          {/* time picker*/}
          <DatePicker style={styleAddEvent.timePicker}
            date={this.state.time}
            mode="time"
            placeholder="heure"
            format="HH:mm"
            confirmBtnText="OK"
            cancelBtnText="Annuler"
            showIcon={false}
            onDateChange={(time) => { this.setState({ time: time }) }}
          />
        </View>

        {/* Button to add the event*/}
        <TouchableOpacity style={styleAddEvent.buttonContainer}
          onPress={this._AddEvent.bind(this)}>
          <Text style={styleAddEvent.buttontext}>
            Ajouter
          </Text>
        </TouchableOpacity>

        {/*
        Decommenter ce code ainsi que la fonction takePicture pour utiliser la camera
            <View>
              <Camera
                ref={(cam) => {
                  this.camera = cam;
                }}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}>
                <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
              </Camera>
            </View>
          */
        }
      </ScrollView>
    );
  }
}

const styleAddEvent = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flex: 1, 
    flexDirection: 'row', 
  },
  titleHeader: {
    flex:2,   
    height: 60,
    paddingTop: 25,
    backgroundColor: LifeAgencyApi.getColorSiiBlue(),
  },
  textTitleHeader : {
    fontFamily: LifeAgencyApi.getFontTitle(),
    fontSize: 30,
    color: 'white',
  },
  buttonLogOut : {
    flex: 0,
  },
  inputName: {
    fontFamily: LifeAgencyApi.getFontTitle(),
    fontSize: 20,
    borderColor: LifeAgencyApi.getColorSiiBlue(),
    borderWidth: 2,
    padding: 10,
    margin: 20,
  },
  inputDescription: {
    textAlignVertical: "top",
    flex: 7,
    fontFamily: LifeAgencyApi.getFontSubTitle(),
    fontSize: 20,
    borderColor: LifeAgencyApi.getColorSiiBlue(),
    borderWidth: 2,
    height: 160,
    margin: 20,
    padding: 10,
  },
  pickerView: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,  
  },
  pickerEventTypes: {
    flex: 3,
    borderColor: LifeAgencyApi.getColorSiiBlue(),
    borderWidth: 2,
  },
  textPicker: {
    flex: 1,
    fontSize: 30,
    fontFamily: LifeAgencyApi.getFontTitle(),
    alignItems: 'center',
  },
  datePicker: {
    flex:3,
    borderColor: LifeAgencyApi.getColorSiiBlue(),
    borderWidth: 2,
    marginRight: 30, 
  },
  timePicker: {
    flex:1,
    borderColor: LifeAgencyApi.getColorSiiBlue(),
    borderWidth: 2,
  },
  /*
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#FFF',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  */
  buttonContainer: {
    flex:1,
    backgroundColor: LifeAgencyApi.getColorSiiBlue(),
    borderRadius: 100,
    margin: 30,
    height: 50,
  },
  buttontext: {
    flex: 1,
    fontFamily: LifeAgencyApi.getFontTitle(),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
    margin: 10
  },
})
