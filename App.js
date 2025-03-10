import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import WifiManager from 'react-native-wifi-reborn';

MapboxGL.setAccessToken('pk.eyJ1IjoibXVrZXNoYXJ5YWwiLCJhIjoiY20xZjZ5YnRyMHFzbzJtczlmZDlxcjh3NCJ9.oU4qPqhUFQoEc2zODtR7sA');

import SocialScreen from './components/SocialScreen';
import AuthenticationScreen from './components/AuthenticationScreen';
import LoginScreen from './components/LoginScreen';
import FullScreenMap from './components/FullScreenMap';
import VideoPlayer from './components/VideoPlayer';
import MeScreen from './components/MeScreen';
import CameraScreen from './components/CameraScreen';


const Stack = createStackNavigator();

const App = () => {

  console.log("App component rendered!");

  const [recorded, setRecorded] = useState(0);

	const connectToESP32 = async () => {

		console.log("Attempting to have connection!");

		if(await WifiManager.isEnabled() === false)
		{

			await WifiManager.setEnabled(true);

			const connected = await WifiManager.isEnabled();

			if(connected === true)
			{
				console.log("The Wifi was turned on!");
			}
			else
			{
				console.log("The Wifi was NOT turned on!");
			}


		}

		else
		{


			try {
    await WifiManager.connectToProtectedSSID('ESP32-Access-Point', '123456789', false, false);
    alert("Connected to the Information System!");

  } catch (error) {
    alert("Can't connect to the Information System.");
  }
		}

};

useEffect(() => {
  connectToESP32();
}, []);

	const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <View style={styles.container}>

        <Stack.Navigator initialRouteName="AuthenticationScreen" screenOptions={{ headerShown: false }} >



        {user ? (
          <>
            <Stack.Screen name="SocialScreen">
              {() => <SocialScreen user={user} setUser={setUser} recorded={recorded} />}
            </Stack.Screen>
            <Stack.Screen name="MeScreen">
              {() => <MeScreen user={user} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="CameraScreen">
              {() => <CameraScreen user={user} setUser={setUser} recorded={recorded} setRecorded={setRecorded} />}
            </Stack.Screen>
            <Stack.Screen name="FullScreenMap" component={FullScreenMap} />
            
            <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
          </>
        ) : (
          <>
            <Stack.Screen name="AuthenticationScreen">
              {() => <AuthenticationScreen user={user} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="LoginScreen">
              {() => <LoginScreen user={user} setUser={setUser} />}
            </Stack.Screen>
          </>
        )}
        </Stack.Navigator>

      </View>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});



