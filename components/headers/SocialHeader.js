import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const SocialHeader = ({navigation}) => {

  return (
    <View style={styles.topBar}>

        <View style={styles.placeholder} />
                                 
      <Text style={styles.title}>Social</Text>

      

      {<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('CameraScreen')}>

          <Image source={require('../../assets/camera.png')} style={styles.icon} />

      </TouchableOpacity>}

                                        
    </View>
  );
};

export default SocialHeader;

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