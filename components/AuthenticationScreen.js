import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

function AuthenticationScreen({ user, setUser }) {

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const camera = useRef(null);
  const device = useCameraDevice('front');


// Function to save photo
const savePhotoToDocuments = async (photoUri, nameOfPhoto) => {
  console.log("Save photo function called!");
  console.log(photoUri);
  const documentsDirectory = RNFS.DocumentDirectoryPath; // Get the Documents directory
  const destinationFolder = `${documentsDirectory}/Profiles`; // Define your folder
  const photoFileName = `${nameOfPhoto}.jpg`; // Specify the name for the saved photo
  const destinationPath = `${destinationFolder}/${photoFileName}`;

  try {
    // Create the folder if it doesn't exist
    await RNFS.mkdir(destinationFolder);
    console.log('Folder created:', destinationFolder);

    // Move the photo to the desired location
    await RNFS.moveFile(photoUri, destinationPath);
    console.log('Photo saved to:', destinationPath);

    const exists = await RNFS.exists(destinationPath);
    console.log("Does the file exist? ", exists);


    return destinationPath; // Return the destination path for further use
  } catch (error) {
    console.error('Error saving photo:', error);
  }
};



  // Function to handle taking a picture
  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      setPhotoUri(photo.path);
    }
  };

  // Function to handle submission (both name and photo)
  const handleProceed = () => {
    if (name.length <= 2) {
      alert('Please enter your name.');
      return;
    }
    if (!photoUri) {
      alert('Please take a profile picture');
      return;
    }

    fetch(`http://192.168.4.1/send?message=${name}`)

    .then(response => response.text())

    .then(data => {

      console.log("Response: ", data);

        // If data is true, user doesn't already exist and is thus stored at the server

        if(data === 'true')
        {

          //  Store the user's profile picture
          // Start the session for the user

          savePhotoToDocuments(photoUri, name);

          setUser(name);
        }

        // If data is false, the user already exists
        else
        {
          alert("This account already exists!");
        }

    })
    .catch(error => {
        alert("Can't connect to the Information System.");
    });

  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome to Odyssey</Text>

      <Text style={styles.otherText}>Let's get you started!</Text>

      <View style={styles.card}>
        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor='#666'
          value={name}
          onChangeText={setName}
        />

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          {device && !photoUri && (
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true}
            />
          )}

          {/* Display preview after taking the photo */}
          {photoUri && (
            <Image source={{ uri: `file://${photoUri}` }} style={styles.preview} />
          )}
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Take Picture or Retake Picture */}
          {!photoUri ? (
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
              <Text style={styles.buttonText}>Retake Picture</Text>
            </TouchableOpacity>
          )}

          {/* Proceed Button */}
          <TouchableOpacity style={styles.button} onPress={handleProceed}>
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.logInText} onPress={() => {navigation.navigate('LoginScreen')}}>I already have an account</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#666",
  },
  otherText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#666',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: '#666',
  },
  cameraContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  buttonsContainer: {
    alignItems: 'center', // Center buttons horizontally
    justifyContent: 'center', // Center buttons vertically
    marginVertical: 10, // Space around the buttons
  },
  button: {
    backgroundColor: '#007BFF', // Button background color
    padding: 15, // Button padding
    borderRadius: 5, // Rounded corners
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.3, // iOS shadow opacity
    shadowRadius: 2, // iOS shadow radius
    marginVertical: 5, // Space between buttons
    width: '80%', // Width of the button (optional)
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Text size
    textAlign: 'center', // Center text
  },
  logInText: {
    color: '#6c30ec',
    textAlign: 'center'
  }
});

export default AuthenticationScreen;
