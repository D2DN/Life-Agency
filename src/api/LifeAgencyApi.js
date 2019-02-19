import RestClient from 'react-native-rest-client';
import APP_CONFIG from '../config/config';
import { AsyncStorage } from 'react-native';

export default class LifeAgencyApi extends RestClient {

    constructor(token) {
        super(APP_CONFIG.apiBaseUrl);
    }

    static getFontHeader(){
        return "DK Lemon Yellow Sun";
    }

    static getFontTitle(){
      return "SEGOEUI";
    }

    static getFontSubTitle(){
      return "SEGOEUI";
    }

    static getColorSiiBlue() {
        return "#3498db";
    }

    async addTokenToHeaders() {
        let token = await AsyncStorage.getItem(APP_CONFIG.token);

        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        };
    }

    async login(user) {
        this.headers = await this.addTokenToHeaders();        
        return this.POST('/login', user);
    }
    
    async logout() {
        this.headers = await this.addTokenToHeaders();                
        return this.GET('/logout');
    }

    async saveTokenAfterLogin(token) {
        this.headers = await this.addTokenToHeaders();        
        return this.POST('/token', token);
    }

    async getAllEvents() {
        this.headers = await this.addTokenToHeaders();        
        return this.GET('/event');
    }

    async getAllEventTypes() {
        this.headers = await this.addTokenToHeaders();        
        return this.GET('/eventType');
    }

    async addEvent(event) {
        this.headers = await this.addTokenToHeaders();        
        return this.POST('/event', event);
    }

    async updateEvent(event) {
        this.headers = await this.addTokenToHeaders();        
        return this.PUT('/event', event);
    }

    async deleteEvent(eventId) {
        this.headers = await this.addTokenToHeaders();        
        return this.DELETE('/event/' + eventId);
    }
}
