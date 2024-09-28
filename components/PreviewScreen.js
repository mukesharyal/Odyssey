// PreviewScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import  Video  from 'react-native-video'; // Ensure you have this installed

const PreviewScreen = ({ videoUri, onSaveForMe, onSaveForPublic, onCancel }) => {

  console.log(videoUri);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Preview</Text>
      <Video
        source={{ uri: videoUri }} // Display the recorded video
        style={styles.video}
        resizeMode="contain"
        shouldPlay
        isLooping
        repeat={true}
      />
      <View style={styles.saveButtonsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={onSaveForMe}>
          <Image source={require('../assets/for_me.png')} style={styles.icon} />
          <Text style={styles.saveButtonText}>For Me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={onSaveForPublic}>
          <Image source={require('../assets/for_social.png')} style={styles.icon} />
          <Text style={styles.saveButtonText}>Public</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: '60%',
  },
  saveButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 25,
    width: '40%',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#666',
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PreviewScreen;
