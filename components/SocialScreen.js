

import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MapComponent from "./MapComponent";  // Assuming this is the Mapbox component
import SocialHeader from "./headers/SocialHeader";
import SocialNavbar from "./navbars/SocialNavbar";
import { useNavigation } from '@react-navigation/native';
import { downloadOfflineMap, removeMap } from './mapService'; // Import your download function
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

const SocialScreen = ({user, setUser, recorded}) => {

  console.log("Social Screen component rendered!");

  const navigation = useNavigation();

  const [val, setVal] = useState(null);

  const [stuffs, setStuffs] = useState({
    videos: [],
    info: '',
    videoName: '',
  });


  const parseDataString = (data) => {
    return data.split('\n').map(line => {
        const [userName, longitude, latitude, unixtime] = line.split(',').map(item => item.trim());
        return {
            userName,
            longitude: parseFloat(longitude), // Convert to float
            latitude: parseFloat(latitude),   // Convert to float
            unixtime: parseInt(unixtime, 10) // Convert to integer
        };
    }).slice(0, -1); // Keep only the first three objects
};

  async function getStuffs() {
    try {
      console.log("Get stuffs called!");

      const videosResponse = await fetch(`http://192.168.4.1/videos`);
      const videosData = await videosResponse.text();
      const parsedVideos = parseDataString(videosData);

      const infoResponse = await fetch(`http://192.168.4.1/info`);
      const infoData = await infoResponse.text();

      const videoNameResponse = await fetch(`http://192.168.4.1/video`);
      const videoNameData = await videoNameResponse.text();



      setStuffs({videos: parsedVideos,
        info: infoData,
        videoName: videoNameData
      });

    } catch (error) {
      alert("Error fetching data: " + error.message);
    }
  }





  useEffect(() => {
    // Call the function to download the offline map when the component mounts
    downloadOfflineMap();

    getStuffs();

  }, [recorded]);


  return (

    <>

    <SocialHeader navigation={navigation} />

    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Example Card */}
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          <Video
            source={require('../assets/Test.mp4')}  // Use file:// for local video path
            style={styles.cardVideo}
            resizeMode="contain"  // Video scaling
            repeat={true}
      />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Information about the place</Text>
            <Text style={styles.cardDescription}>
              {stuffs.info}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Map Card */}
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Card Title</Text>
          </View>
          
          {/* Map inside the card */}
          <View style={styles.mapContainer} onStartShouldSetResponder={() => true} // Enables the View to become "clickable"
      onResponderRelease={() => { 
        navigation.navigate('FullScreenMap', {videos: stuffs.videos, visibility: 'public'})}} >
            <MapComponent videos={stuffs.videos}/>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>

    <SocialNavbar navigation={navigation} />

    </>
  );
};

export default SocialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 30,
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  cardContent: {
    padding: 15,
  },
  cardVideo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
    width: '100%',
    height: 300
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'justify',
    lineHeight: 25,
  },
  cardTitle: {
    fontSize: 18,
    color: '#666',
    lineHeight: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  mapContainer: {
    height: 300,  // Adjust the map height
    width: '100%',  // Full width of the card
  },
});
