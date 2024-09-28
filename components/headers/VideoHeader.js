import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const CameraHeader = ({navigation}) => {

  return (
    <View style={styles.topBar}>


    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>

          <Image source={require('../../assets/back.png')} style={styles.icon} />

      </TouchableOpacity>

                                 
      <Text style={styles.title}>Video Player</Text>


       <View style={styles.placeholder} />

                                        
    </View>
  );
};

export default CameraHeader;

const styles = StyleSheet.create({
  topBar: {
    position: 'sticky',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  // Ensure equal spacing between left, center, and right
    width: '100%',
    height: 60,
    backgroundColor: '#ffffff',
    elevation: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',  // Center the title text
    flex: 1,  // Take up all available space between placeholder and icon
  },
  placeholder: {
    width: 24,  // Same width as the icon to balance the space on both sides
  },
  iconContainer: {
    padding: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});