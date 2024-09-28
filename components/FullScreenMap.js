import MapboxGL from '@rnmapbox/maps';
import { useRoute } from '@react-navigation/native';
import { View, StyleSheet, Text, Image } from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

function FullScreenMap() {

  const route = useRoute();

  const navigation = useNavigation();

  function showVideo()
  {
    console.log(this.video);
    navigation.navigate('VideoPlayer', {video: this.video, visibility: route.params.visibility})
  }


  return (
    <MapboxGL.MapView style={{ flex: 1 }}>
      <MapboxGL.Camera
        centerCoordinate={[85.329684, 27.695222]} // Set your initial center
        zoomLevel={20} // Set initial zoom level to 16
        minZoomLevel={16} // Minimum zoom level
        maxZoomLevel={20} // Maximum zoom level // Adjust as necessary
      />

      {route.params.videos && route.params.videos.map((video, index) => (
        <MapboxGL.PointAnnotation
          key={index.toString()} // Use index as a key, or you can use a unique identifier if available
          id={`marker-${index}`} // Unique id for each marker
          video={video}
          visibility={route.params.visibility}
          coordinate={[video.longitude, video.latitude]}
          onSelected={showVideo}
           > 
          
          <View style={styles.markerContainer}>

          <Text style={styles.markerText}> {video.userName.charAt(0).toUpperCase() } </Text>

          </View>

        </MapboxGL.PointAnnotation>
      ))}

      

    </MapboxGL.MapView>
  );
};

export default FullScreenMap;

const styles = StyleSheet.create({

  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 45,
    backgroundColor: '#f08080',
    alignItems: 'center', // Horizontally center content
    justifyContent: 'center', // Vertically center content
    elevation: 5,
  },

  markerText: {
    color: '#666',
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold'
  }

});