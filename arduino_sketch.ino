#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>

const char *ssid = "ESP32-Access-Point";  // SSID for the Access Point
const char *password = "123456789";       // Password for the Access Point
WebServer server(80);                     // Create a web server object

// Files to store data
const char *dataFile = "/data.txt";       // For string storage
const char *videosFile = "/videos.txt";   // For video data storage

// Sample text for /info route
const String infoText = "Madan Bhandari Memorial College, a non-profit making community institution, was established in 2001 to impart quality education at an affordable cost. The college offers a wide range of academic courses in XI, XII, BA, BBS, BBM, BCA, BScCSIT, and Master’s Degree courses in Sociology, Journalism, and English. Since its inception, the college has achieved remarkable success in terms of quality education and infrastructural development. It has received generous help from many individuals and institutions for the enhancement of quality education and the development of infrastructural facilities. It is managed by a dedicated team of educationists, academics, and social workers.";

// Function to initialize SPIFFS
void initSPIFFS() {
    if (!SPIFFS.begin(true)) {
        Serial.println("An error has occurred while mounting SPIFFS");
        return;
    }
}

// Function to read and print the contents of the file
void printFileContents(const char* filename) {
    File file = SPIFFS.open(filename, "r");
    if (!file) {
        Serial.println("Failed to open file for reading");
        return;
    }

    Serial.println("Contents of " + String(filename) + ":");
    while (file.available()) {
        String line = file.readStringUntil('\n');
        Serial.println(line);  // Print each line
    }
    file.close();
}

// Function to check if string exists in the file
bool stringExists(const String &str) {
    File file = SPIFFS.open(dataFile, "r");
    if (!file) {
        Serial.println("Failed to open file for reading");
        return false;
    }

    String trimmedStr = str; // Create a copy of str
    trimmedStr.trim();       // Trim the copy

    while (file.available()) {
        String line = file.readStringUntil('\n');
        line.trim(); // Trim the line read from the file
        if (line.equalsIgnoreCase(trimmedStr)) {  // Case-insensitive comparison
            file.close();
            return true;  // String found
        }
    }
    
    file.close();
    return false;  // String not found
}

// Function to store new string in the data file
void storeString(const String &str) {
    File file = SPIFFS.open(dataFile, "a");  // Open file in append mode
    if (file) {
        file.println(str);  // Write the string to the file
        file.close();
    } else {
        Serial.println("Failed to open file for writing");
    }
}

// Function to store video data in the videos file
void storeVideoData(const String &userName, const String &longitudeStr, const String &latitudeStr, unsigned long unixtime) {
    File file = SPIFFS.open(videosFile, "a");
    if (file) {
        String data = String(userName) + ", " + longitudeStr + ", " + latitudeStr + ", " + String(unixtime);
        file.println(data);
        file.close();
    } else {
        Serial.println("Failed to open videos file for writing");
    }
}

// Handle incoming GET requests for storing video data
void handleStoreVideo() {
    String userName = server.arg("userName");
    String longitudeStr = server.arg("longitude"); // Retrieve as String
    String latitudeStr = server.arg("latitude");   // Retrieve as String
    unsigned long unixtime = server.arg("unixtime").toInt();

    storeVideoData(userName, longitudeStr, latitudeStr, unixtime);
    server.send(200, "text/plain", "Video data stored successfully");

    printFileContents(videosFile);
}

// Handle incoming GET requests for retrieving video data
void handleGetVideos() {
    File file = SPIFFS.open(videosFile, "r");
    if (!file) {
        server.send(500, "text/plain", "Failed to open videos file");
        return;
    }

    String videosData = "";
    while (file.available()) {
        videosData += file.readStringUntil('\n') + "\n"; // Append each line to videosData
    }
    file.close();

    server.send(200, "text/plain", videosData);  // Send the entire file content
}

// Handle incoming GET requests for string messages
void handleGet() {
    String message = server.arg("message");  // Get the message from the request
    Serial.println("Received message: " + message);

    // Check if the string already exists
    if (stringExists(message)) {
        server.send(200, "text/plain", "false");  // Send 'false' response
    } else {
        storeString(message);  // Store new string
        server.send(200, "text/plain", "true");  // Send 'true' response
    }

    // Print file contents after each request
    printFileContents(dataFile);
}

// Handle incoming GET requests for /info
void handleInfo() {
    server.send(200, "text/plain", infoText);  // Send the hardcoded sample text
}

// Handle incoming GET requests for /video
void handleVideo() {
    String videoFileName = "Test.mp4";  // Sample video file name
    server.send(200, "text/plain", videoFileName);  // Send the file name
}

// Handle incoming GET requests for /users (returns all users in data.txt)
void handleGetUsers() {
    File file = SPIFFS.open(dataFile, "r");
    if (!file) {
        server.send(500, "text/plain", "Failed to open data file");
        return;
    }

    String usersData = "";
    while (file.available()) {
        usersData += file.readStringUntil('\n') + "\n"; // Append each line to usersData
    }
    file.close();

    server.send(200, "text/plain", usersData);  // Send the entire file content
}

// Handle incoming GET requests for /clear (clears data.txt and videos.txt contents)
void handleClear() {
    File file;

    // Clear data.txt
    file = SPIFFS.open(dataFile, "w");
    if (file) {
        file.close();
    } else {
        server.send(500, "text/plain", "Failed to clear data file");
        return;
    }

    // Clear videos.txt
    file = SPIFFS.open(videosFile, "w");
    if (file) {
        file.close();
    } else {
        server.send(500, "text/plain", "Failed to clear videos file");
        return;
    }

    server.send(200, "text/plain", "Files cleared successfully");
}

void setup() {
    Serial.begin(115200);
    initSPIFFS();  // Initialize SPIFFS

    // Check if the data file exists
    if (!SPIFFS.exists(dataFile)) {
        File file = SPIFFS.open(dataFile, "w"); // Create the file if it doesn't exist
        if (!file) {
            Serial.println("Failed to create data file");
        } else {
            file.close();
            Serial.println("data.txt created");
        }
    }

    // Check if the videos file exists
    if (!SPIFFS.exists(videosFile)) {
        File file = SPIFFS.open(videosFile, "w"); // Create the file if it doesn't exist
        if (!file) {
            Serial.println("Failed to create videos file");
        } else {
            file.close();
            Serial.println("videos.txt created");
        }
    }

    // Set up the Access Point
    WiFi.softAP(ssid, password);
    Serial.println("Access Point started. IP address: " + WiFi.softAPIP().toString());

    // Set up the server routes
    server.on("/send", HTTP_GET, handleGet);           // Store message strings
    server.on("/store", HTTP_GET, handleStoreVideo);   // Store video data
    server.on("/videos", HTTP_GET, handleGetVideos);   // Retrieve video data
    server.on("/info", HTTP_GET, handleInfo);          // Hardcoded info text
    server.on("/video", HTTP_GET, handleVideo);        // Return sample video file name
    server.on("/users", HTTP_GET, handleGetUsers);     // Retrieve all users from data.txt
    server.on("/clear", HTTP_GET, handleClear);        // Clear contents of data.txt and videos.txt
    server.begin();  // Start the server
    Serial.println("Server started");
}

void loop() {
    server.handleClient();  // Handle incoming client requests
}
