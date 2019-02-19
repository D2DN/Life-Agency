import {
    AsyncStorage
} from 'react-native';
import APP_CONFIG from '../../config/config';
import { ReactNativeAD } from 'react-native-azure-ad';
import MicrosoftGraphApi from '../../api/MicrosoftGraphApi';
import LifeAgencyApi from '../../api/LifeAgencyApi';

const api = new LifeAgencyApi();
const microsoftGraphApi = new MicrosoftGraphApi();

export default class LoginUser {

    static async loginUserAfterAuth(token, navigation) {
        const { displayName, mail } = await microsoftGraphApi.me(token);

        let user = {
            name: displayName,
            email: mail,
            groups: await this.getUserGroups(token)
        };

        await AsyncStorage.setItem(APP_CONFIG.token, token);        

        this.createSessionForUser(user);
    }

    static async getUserGroups(token) {
        let { value } = await microsoftGraphApi.memberOf(token);

        let groups = [];

        for (let i = 0; i < value.length; i++) {
            groups.push(value[i].displayName);
        }
        return groups;
    }

    static async createSessionForUser(user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));        

        api.login(user).then(() => {}).catch(error => {
            console.log("Error new session for logged user: " + JSON.stringify(error));
        });
    }
}