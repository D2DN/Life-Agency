import {
    NetInfo,
    Platform
} from 'react-native';

async function isConnectedIOS () {
    try {
      const res = await fetch('https://google.com');
      
      if (res.status === 200) {
          return true;
      }
    } catch (e) {
        return false;        
    }
};

async function isConnectedAndroid(){
   return await NetInfo.isConnected.fetch();   
}

export default function isConnectedInternet() {
    return (Platform.OS === "ios" ) ? isConnectedIOS() : isConnectedAndroid();
}