import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TopBar = () => {

  return (
    <View style={styles.topBar}>
      {/* Empty view for left spacing, ensuring title remains centered */}

      {screen !== "CameraScreen" ? 

                                          <View style={styles.placeholder} />

                                          :

                                          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('SocialScreen')}>
                                            <Image
                                              source={require('../assets/back.png')}  // Replace with your icon path
                                              style={styles.icon}
                                            />
                                          </TouchableOpacity>

                                        }

      {/* Title in the center */}
      <Text style={styles.title}>{title}</Text>

      {/* Icon on the right */}
      {/*<TouchableOpacity style={styles.iconContainer} onPress={() => handleNavigation('CameraScreen')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Image
          source={require('../assets/camera.png')}  // Replace with your icon path
          style={styles.icon}
        />
      </TouchableOpacity>*/}


      {screen === "CameraScreen" ? 

                                          <View style={styles.placeholder} />

                                          :

                                          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('CameraScreen')}>
                                            <Image
                                              source={require('../assets/camera.png')}  // Replace with your icon path
                                              style={styles.icon}
                                            />
                                          </TouchableOpacity>

                                        }
    </View>
  );
};

export default TopBar;

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