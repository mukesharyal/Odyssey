import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import PreviewScreen from './PreviewScreen'; // Import PreviewScreen
import CameraHeader from "./headers/CameraHeader";
import { useNavigation } from '@react-navigation/native';
import WifiManager from 'react-native-wifi-reborn';
import Geolocation from 'react-native-geolocation-service';
import RNFS from 'react-native-fs';

function CameraScreen({user, setUser, recorded, setRecorded}) {

  const camera = useRef(null);
  const device = useCameraDevice('front');
  const { hasPermission } = useCameraPermission();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [videoUri, setVideoUri] = useState(null); // To store the video URI
  const [location, setLocation] = useState(null);
  let timer = useRef(null);


  const getLocation = async () => {


    Geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude }); // Set location in state
            },
            (error) => {
              console.error(error);
              Alert.alert('Error', 'Failed to get location');
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
          );


  }


  const navigation = useNavigation();

  const handleRecording = async () => {

    if (!camera.current) {
      console.error("Camera is not ready yet.");
      return;
    }

    if (isRecording) {
      if (elapsedTime >= 1) {
        try {

          await camera.current.stopRecording();
          setIsRecording(false);
          clearInterval(timer.current);
        } catch (error) {
          console.error('Failed to stop recording:', error);
        }
      } else {
        Alert.alert("Wait", "Video recording hasn't been started yet!");
      }
    } else {
      try {
         getLocation();

        await camera.current.startRecording({
          quality: '1080p',
          onRecordingFinished: (video) => {
            console.log(video);
            setVideoUri(video.path); // Save the video URI
            setRecordingCompleted(true);
            console.log(recordingCompleted);
          },
          onRecordingError: (error) => console.error(error),
        });
        setIsRecording(true);
        startTimer();
      } catch (error) {
        console.error('Failed to start recording:', error);
        Alert.alert('Error', 'Failed to start recording');
      }
    }
  };

  const startTimer = () => {
    setElapsedTime(0);
    timer.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  };

  useEffect(() => {

    return () => {
      clearInterval(timer.current);
    };


  }, []);



const saveVideoToPublic = async (videoUri) => {
  console.log("Save video function called!");
  console.log(videoUri);

  // Ensure that the user is logged in before proceeding
  if (!user) {
    Alert.alert('Error', 'User is not authenticated.');
    return;
  }

  // Get the documents directory and define the destination folder
  const documentsDirectory = RNFS.DocumentDirectoryPath; 
  const destinationFolder = `${documentsDirectory}/Public`; 

  const unixTime = Math.floor(Date.now() / 1000);
  console.log("The video is to be saved at this", unixTime); 

  // Get the current WiFi SSID
  const connectedWifi = await WifiManager.getCurrentWifiSSID();
  if (connectedWifi !== "ESP32-Access-Point") {
    alert("Connection to the Information System lost.");
    return;
  } else {
    console.log("Yayy! We are still connected!");
  }

  // Construct the URL for the fetch request
  const url = `http://192.168.4.1/store?userName=${user}&longitude=${location.longitude}&latitude=${location.latitude}&unixtime=${unixTime}`;
  console.log("URL: ", url);

  const videoFileName = `${unixTime}.mp4`; 
  const destinationPath = `${destinationFolder}/${videoFileName}`;

  console.log(videoFileName, destinationPath);

  try {
    // Create the folder if it doesn't exist
    const folderExists = await RNFS.exists(destinationFolder);
    if (!folderExists) {
      await RNFS.mkdir(destinationFolder);
      console.log('Folder created:', destinationFolder);
    }

    // Move the video file to the destination folder
    await RNFS.moveFile(videoUri, destinationPath);
    console.log('Video saved to:', destinationPath);

    // Confirm the file exists at the destination
    const exists = await RNFS.exists(destinationPath);
    console.log("Does the file exist? ", exists);

    // Read the contents of the Documents directory
    const files = await RNFS.readDir(destinationFolder);

    console.log(files);

    const response = await fetch(url);
    const data = await response.text();
    console.log("Response: ", data);

    console.log(recorded);

    setRecorded((prev) => prev + 1);

    navigation.goBack();
    
  } catch (error) {
    console.error('Error saving video:', error);
    Alert.alert('Error', 'Failed to save video');
  }
};








  const saveVideoForMe = async (videoUri) => {

      console.log("Save video for me function called!");
        console.log(videoUri);

        // Ensure that the user is logged in before proceeding
        if (!user) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }

        // Get the documents directory and define the destination folder
        const documentsDirectory = RNFS.DocumentDirectoryPath; 
        const destinationFolder = `${documentsDirectory}/Me`;

        const fileLocation = `${destinationFolder}/private.txt`; 

        const unixTime = Math.floor(Date.now() / 1000);
        console.log("The video is to be saved at this", unixTime); 

        const videoFileName = `${unixTime}.mp4`; 
        const destinationPath = `${destinationFolder}/${videoFileName}`;

        console.log(videoFileName, destinationPath);

        try {
          // Create the folder if it doesn't exist
          const folderExists = await RNFS.exists(destinationFolder);
          if (!folderExists) {
            await RNFS.mkdir(destinationFolder);
            console.log('Folder created:', destinationFolder);
          }

          // Move the video file to the destination folder
          await RNFS.moveFile(videoUri, destinationPath);
          console.log('Video saved to:', destinationPath);

          // Confirm the file exists at the destination
          const exists = await RNFS.exists(destinationPath);
          console.log("Does the file exist? ", exists);

          // Format the data to be written
        const data = `${user}, ${location.longitude}, ${location.latitude}, ${unixTime}\n`;

        // Append data to the file
        await RNFS.appendFile(fileLocation, data, 'utf8');

        console.log("Video data stored successfully for private use!");

        // Read the content of the file
        const fileContents = await RNFS.readFile(fileLocation, 'utf8');

        console.log(fileContents);

          

          setRecorded((prev) => prev + 1);

          navigation.goBack();
          
        } catch (error) {
          console.error('Error saving video:', error);
          Alert.alert('Error', 'Failed to save video');
        }


  }







  const handleSaveForMe = () => {
    console.log("Save for Me button clicked");
    // Logic to save the video locally
    saveVideoForMe(videoUri);
  };

  const handleSaveForPublic = () => {
    console.log("Save for Public button clicked");
    // Logic to upload the video or make it public
   saveVideoToPublic(videoUri);
  };

  const handleCancel = () => {
    setRecordingCompleted(false); // Reset the recording completed state
    setVideoUri(null); // Clear the video URI
    navigation.goBack();
  };

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <>
    <CameraHeader navigation={navigation} />
    <View style={styles.container}>
      {!recordingCompleted ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            video={true}
            audio={true}
          />
          { isRecording && <Text style={styles.timer}>{elapsedTime}s</Text>}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.button, isRecording ? styles.squareButton : styles.circleButton]}
              onPress={handleRecording}
            />
          </View>
        </>
      ) : (
        <PreviewScreen 
          videoUri={videoUri}
          onSaveForMe={handleSaveForMe}
          onSaveForPublic={handleSaveForPublic}
          onCancel={handleCancel}
        />
      )}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  timer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    fontSize: 24,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareButton: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default CameraScreen;
