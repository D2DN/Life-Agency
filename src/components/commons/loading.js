import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import LifeAgencyApi from '../../api/LifeAgencyApi';


/*
    This component is modular and independent
    This allow to display an activity indicator when the page is not always loaded.
*/
export default class Loading extends Component {
    
    render() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                     style={[styles.centering, {transform: [{scale: 1.5}]}]}
                     size="large"
                     color= {LifeAgencyApi.getColorSiiBlue()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    centering: {
        backgroundColor: 'white',        
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height / 2,        
        padding: 8,
      }
});
