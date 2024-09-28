import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { Card, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import VideoHeader from './headers/VideoHeader';
import RNFS from 'react-native-fs';

const VideoPlayer = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const video = route.params.video; // Passing video data via navigation

  const visibility = route.params.visibility;

  console.log(visibility);

  const directory = visibility === 'public' ? 'Public' : 'Me';

  console.log(video);

  console.log(`file:///${RNFS.DocumentDirectoryPath}/${directory}/${video.unixtime}.mp4`);

  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const onBuffer = () => setLoading(true); // Handle buffering
  const onEnd = () => setPaused(true); // Pause when video ends
  const onLoad = () => setLoading(false); // When video is loaded


  function formatDateFromUnix(unixTimestamp) {
  // Convert the Unix timestamp to milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Extract the year, month name, and day
  const year = date.getFullYear();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()]; // Get the month name
  const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero

  // Return the formatted date as "Day Month Year"
  return `${month} ${day}, ${year}`;
}

  return (
    <>
    <VideoHeader navigation={navigation} />
    <View style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Avatar
            rounded
            size="medium"
            source={{ uri: `file:///${RNFS.DocumentDirectoryPath}/Profiles/${video.userName}.jpg` }} // Profile picture
            containerStyle={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.userName}>{video.userName}</Text>
            <Text style={styles.timePosted}>{formatDateFromUnix(video.unixtime)}</Text>
          </View>
        </View>

        <View style={styles.videoContainer}>
          {loading && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
          )}
          <Video
            source={{ uri: `file:///${RNFS.DocumentDirectoryPath}/${directory}/${video.unixtime}.mp4` }} // Video URL
            style={styles.video}
            controls={true} // Video player controls
            paused={paused}
            onBuffer={onBuffer}
            onLoad={onLoad}
            onEnd={onEnd}
            resizeMode="cover"
          />
        </View>
      </Card>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '90%',
    padding: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#666'
  },
  timePosted: {
    color: 'gray',
    fontSize: 12,
  },
  videoContainer: {
    height: 300,
    backgroundColor: '#000',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  playPauseButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1e90ff',
    borderRadius: 30,
    padding: 10,
  },
  avatar: {
    transform: [{ rotate: '-90deg' }]
  }
});

export default VideoPlayer;
