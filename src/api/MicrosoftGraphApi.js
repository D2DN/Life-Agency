import RestClient from 'react-native-rest-client';
import { ReactNativeAD } from 'react-native-azure-ad';

export default class MicrosoftGraphApi extends RestClient {

    constructor(reactNativeAd) {
        super(MicrosoftGraphApi.getBaseUrl());
    }

    static getBaseUrl() {
        return 'https://graph.microsoft.com/v1.0/';
    }

    addBearerTokenToHeaders(token) {
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    me(token) {
        this.addBearerTokenToHeaders(token);
        return this.GET('/me?$select=displayName,mail');
    }

    memberOf(token) {
        this.addBearerTokenToHeaders(token);
        return this.GET('/me/memberOf?$select=displayName')
    }
}