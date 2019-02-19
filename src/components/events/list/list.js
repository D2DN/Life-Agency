import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Image,
  Button,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  ListView,
  Alert,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import Moment from 'moment';

import Loading from '../../commons/loading';
import DetailEvent from '../details/detailEvent';
import LifeAgencyApi from '../../../api/LifeAgencyApi';
import APP_CONFIG from '../../../config/config';

const api = new LifeAgencyApi();

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2
});


const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.StatusBar, {backgroundColor}]}>
    <StatusBar backgroundColor={backgroundColor} {...props}/>
  </View>
);

const SOURCE_IMAGE = "../../../img/favicon/sii.jpeg";

export default class ListEvent extends React.Component {


  /* Option of the page */
  static navigationOptions = ({ navigation }) => ({
    title: "Event",
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

  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
      isLoading: true,
      refreshing: false,
      token: null,
      showButtonAddEvent: false
    }

    this.renderRow = this.renderRow.bind(this);
    this.listEvents = this.listEvents.bind(this);
    this.onRefreshList = this.onRefreshList.bind(this);
  }

  /* Function who allows to recovery all the events from the database*/
  listEvents() {
    const getEvent = async () => {
      let resp = await api.getAllEvents()
        .then(respJson => {
          if (respJson.hasOwnProperty('data')) {
            this.setState({
              isLoading: false,
              refreshing: false,
              dataSource: ds.cloneWithRows(respJson.data)
            });
          } else {
            //TODO HANDLE ERRORS alert(r.error.message);
            Alert.alert('Oups', 'Récupération impossible des events');
          }
        }).catch((error) => {
          this.setState({
            isLoading: false,
            refreshing: false
          });
        });
    };
    getEvent();
  }

  async checkIfUserCanAddEvent() {
    let user = await AsyncStorage.getItem('user');

    user = JSON.parse(user);

    for(let i = 0; i < user.groups.length; i++) {           
      if (user.groups[i] === APP_CONFIG.admGroup) {
        this.setState({
          showButtonAddEvent: true
        });
        return;
      }
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
    this.checkIfUserCanAddEvent();
  }

  componentDidMount() {
    this.listEvents();
  }

  render() {
    const { navigate } = this.props.navigation;
    let showButtonAddEvent = this.state.showButtonAddEvent;

    
    {/*If the list it is not already launch then the loading component is display*/ }
    if (this.state.isLoading) {
      return <Loading />;
    } else {
      return (
        <View style={styleList.containter}>

          <ListView style={styleList.listView}
            removeClippedSubviews={true}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSeparator=
            {
              (sectionId, rowId) => <View key={rowId} style={styleList.separator} />
            }
            refreshControl=
            {
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefreshList} />
            }
          />

          {/*If the user group is admin then we display the button 'add'*/}
          {showButtonAddEvent === true ?
            <View style={styleList.viewAddEvent}>
              <TouchableHighlight activeOpacity={0.8} underlayColor='white' style={styleList.buttonAddEvent} onPress={() => navigate('addEvent')}>
                <Image style={{ width: 50, height: 50 }} source={require('../../../../img/favicon/ButtonPlus.png')} />
              </TouchableHighlight>
            </View>
            : null
          }


        </View>
      );
    }
  }

  onRefreshList() {
    this.setState({ refreshing: true });
    this.listEvents();
  }

  renderRow(rowData, sectionID, rowID) {
    let urlImage = '';
    Moment.locale('en');
    let date = rowData.date;
    if (rowData.imgEvent === null) {
      this.urlImage = APP_CONFIG.apiBaseUrl + rowData.eventType.banner.url;
      rowData.urlImage = APP_CONFIG.apiBaseUrl + rowData.eventType.banner.url;
    } else if (rowData.imgEvent !== null) {
      this.urlImage = APP_CONFIG.apiBaseUrl + rowData.imgEvent.url;
      rowData.urlImage = APP_CONFIG.apiBaseUrl + rowData.imgEvent.url;
    }
    return (

      <TouchableHighlight
        activeOpacity={0.2}
        underlayColor={'#eff0f2'}
        onPress={() =>
          this.props.navigation.navigate('detail', {
            data: rowData, title: rowData.title,
            description: rowData.description,
            date: rowData.date,
            imageSource: rowData.urlImage
          })}>

        <View style={styleList.eventContainer}>

          {/*View for image of the Event*/}
          <View style={styleList.eventContainerImage}>
            <Image source={{ uri: this.urlImage, headers: {Authorization: this.state.token}}} style={styleList.eventListIcon} />
          </View>

          {/*View for date, title & subTitle of the Event*/}
          <View style={styleList.eventContainerText}>
            <Text style={styleList.date}>
              {Moment(date).format('MMM DD, YYYY')}
            </Text>

            <Text style={styleList.title}>
              {rowData.title}
            </Text>

            <Text style={styleList.subtitle} numberOfLines={1} ellipsizeMode='tail'>
              {rowData.description}
            </Text>
          </View>

        </View>

      </TouchableHighlight>
    );
  }
}

ListEvent.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styleList = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  viewAddEvent: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    transform: [{ 'translate': [Dimensions.get('window').width - 60, Dimensions.get('window').height - 150, 1] }]
  },
  buttonAddEvent: {
    backgroundColor: 'transparent'
  },
  listView: {
    backgroundColor: 'white',
  },
  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
  },
  eventContainerImage: {
    flex: 1,
  },
  eventListIcon: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,    
    marginRight: 0,
    borderRadius: 50,
    height: 60,
    width: 60
  },
  eventContainerText: {
    flex:3,
    flexDirection:'column'
  },
  date: {
    fontFamily: LifeAgencyApi.getFontTitle(),
    color: 'grey',
  },
  title: {
    fontFamily: LifeAgencyApi.getFontTitle(),
    fontSize: 25,
    color: 'black',
    fontWeight: "bold"
   
  },
  subtitle: {
    fontFamily: LifeAgencyApi.getFontSubTitle(),
    color: 'grey',
    fontSize:15,
    
  },
  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey'
  },
  buttonAddEvent: {
  },
});
