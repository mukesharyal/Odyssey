//import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const SocialNavbar = ({navigation}) => {


  return (
    <View style={styles.navbar}>
      {/* Social Section */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SocialScreen')}>
        <Image 
          source={require('../../assets/social_blue.png')} 
          style={styles.icon}
        />
        <Text style={[styles.navLabel, { color: '#6c30ec'}]}>Social</Text>
      </TouchableOpacity>

      {/* Me Section */}
      {<TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MeScreen')}>
        <Image 
          source={require('../../assets/me_black.png')} 
          style={styles.icon}
        />
        <Text style={[styles.navLabel, { color: '#5f6368' }]}>Me</Text>
      </TouchableOpacity>}
    </View>
  );
};

export default SocialNavbar;

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#ffffff',
    elevation: 5,
    padding: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
    marginTop: 5,
  },
  navLabel: {
    fontSize: 16,
  },
});
