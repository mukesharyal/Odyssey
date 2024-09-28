import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Button } from 'react-native';
import MeHeader from "./headers/MeHeader";
import MeNavbar from "./navbars/MeNavbar";
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import MapComponent from "./MapComponent";  // Assuming this is the Mapbox component



const MeScreen = ({user, setUser}) => {

  const [videos, setVideos] = useState([]);

  const navigation = useNavigation();

  const documentsDirectory = RNFS.DocumentDirectoryPath; // Get the Documents directory
  const destinationFolder = `${documentsDirectory}/Profiles`; // Define your folder
  const destinationPath = `${destinationFolder}/${user}.jpg`;

  const filePath = `file:///${destinationPath}`;

  const getData = async() => {
const stat = await RNFS.stat(destinationPath);
    console.log('File Info:', stat);
  };

  getData();


  function clearData()
  {
    console.log("Attempting to clear data!");
    deleteFolderAndContents(`${RNFS.DocumentDirectoryPath}/Profiles`);
    deleteFolderAndContents(`${RNFS.DocumentDirectoryPath}/Public`);
    deleteFolderAndContents(`${RNFS.DocumentDirectoryPath}/Me`);

    fetch(`http://192.168.4.1/clear`)

    .then(response => response.text())

    .then(data => {

      console.log(data);

       })
    .catch(error => {
        alert(error);
    });

    setUser(null);


  }


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


const deleteFolderAndContents = async (folderPath) => {
  try {
    // Read the contents of the directory
    const items = await RNFS.readDir(folderPath);

    // Delete each item in the folder
    await Promise.all(
      items.map(async (item) => {
        if (item.isFile()) {
          // If it's a file, unlink (delete) it
          await RNFS.unlink(item.path);
        } else if (item.isDirectory()) {
          // If it's a directory, unlink (delete) it
          await RNFS.unlink(item.path);
        }
      })
    );

    // Finally, remove the empty directory
    await RNFS.unlink(folderPath);
    console.log(`Successfully deleted folder and its contents: ${folderPath}`);

  } catch (error) {
    console.error(`Error deleting folder and contents: ${error.message}`);
  }
};

function getVideos() {

  getPrivateVideos();
}

  // Function to retrieve video data from private.txt
const getPrivateVideos = async () => {
  const fileLocation = `${RNFS.DocumentDirectoryPath}/Me/private.txt`;

    try {
        // Check if the file exists
        const fileExists = await RNFS.exists(fileLocation);

        if (!fileExists) {
            console.log('No private videos found.');
            return [];
        }

        // Read the content of the file
        const fileContents = await RNFS.readFile(fileLocation, 'utf8');

        const parsedArray = parseDataString(fileContents);


        console.log(parsedArray);

                // Function to filter based on userName
        const filterByUserName = (array, key) => {
          return array.filter(item => item.userName === key);
        };

        // Example usage:
        const filteredData = filterByUserName(parsedArray, user);
        console.log("The filtered data is ", filteredData);

        setVideos(filteredData);

    } catch (error) {
        console.error('Failed to retrieve private videos:', error);
        return [];
    }
};


  console.log("The image is asked from: ",destinationPath);

  const handleLogout = () => {
    setUser(null);
  }


  useEffect(() => {

    getVideos();

  }, []);




  return (
    <>
    <MeHeader navigation={navigation} />
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>


      {/* Example Card */}
        <View style={styles.cardContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: filePath }} style={styles.profileImage} />
        <Text style={styles.userName}>{user}</Text>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
        

        {/* Map Card */}
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          <View style={styles.cardContent}>
            <Text style={styles.cardDescription}>Teqndnjnjcqjwdnqdn</Text>
          </View>
          
          {/* Map inside the card */}
          <View style={styles.mapContainer} onStartShouldSetResponder={() => true} // Enables the View to become "clickable"
      onResponderRelease={() => { 
        navigation.navigate('FullScreenMap', {videos: videos, visibility: 'private'})}} >
            <MapComponent videos={videos}/>
          </View>
        </TouchableOpacity>


        <View>
    <TouchableOpacity 
        onPress={clearData} 
        style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginBottom: 20 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Clear Data</Text>
      </TouchableOpacity>
      </View>

      </ScrollView>

    </View>

    <MeNavbar navigation={navigation} />
    </>
  );
};

export default MeScreen;

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
  cardImage: {
    width: '100%',
    height: 300,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'justify',
    lineHeight: 25,
  },
  mapContainer: {
    height: 300,  // Adjust the map height
    width: '100%',  // Full width of the card
  },
   cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    transform: [{ rotate: '-90deg' }] // Rotate the image manually if needed
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: 20,
    height: 20
  }
});