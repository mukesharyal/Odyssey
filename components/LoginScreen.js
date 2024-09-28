import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({user, setUser}) => {

  const [name, setName] = useState('');

  function getValuesFromDataString(dataString) {
  // Split the data string by line breaks to create an array of values
  return dataString.split(/\r?\n/).filter(Boolean);
}

  const handleLogin = () => {

    if (name.length <= 2) {
      alert('Please enter your name.');
      return;
    }

    fetch(`http://192.168.4.1/users`)

    .then(response => response.text())

    .then(data => {

      let isFound = false;

      const result = getValuesFromDataString(data);
      console.log(result);

      result.map((item, index) => {


          if(item === name)
          {
              setUser(item);

              isFound = true;

              return;
              
          }
      });



      // If the code reaches this point, the user was not found

      if(!isFound)
      {

        alert("This account doesn't exist.");

      }

    })
    .catch(error => {
        alert(error);
    });


  };

  return (
    <View style={styles.container}>
      {/* Dimmed background */}
      <View style={styles.dimBackground} />

      {/* Highlighted card */}
      <View style={styles.card}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor='#666'
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Dimmed background style
  dimBackground: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background with 50% opacity
  },
  // Card style
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center', // Aligns content to center
    zIndex: 1, // Ensures the card is on top of the dimmed background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#666'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#666'
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
