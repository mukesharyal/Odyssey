
# Odyssey

## Team Name: First Steps  
**Theme:** Travel and Tourism  

### Problem Statement
The journey to new destinations is often overshadowed by the overwhelming need for preparation and research, which diminishes the joy of discovery. Many travelers find themselves disconnected from the rich history, culture, and shared experiences that could enhance their journeys. As a result, the essence of adventure—serendipity, connection, and the thrill of uncovering the unknown—is lost amid the information overload.

### Proposed Solution
We introduce **Odyssey**, a digital companion designed to reignite the spirit of adventure and human connection. Odyssey is not just a tool, but a bridge between past, present, and future travelers. Our web application, supported by an innovative IoT-based information system, offers real-time insights as travelers explore new terrains. Odyssey creates a sense of community by allowing travelers to share stories, knowledge, and emotions, enriching each journey through a shared tapestry of human experience.

### Implementation Plan
Odyssey is built on the fusion of advanced technology and user-centered design. It will be developed using **React Native**, ensuring compatibility with both iOS and Android platforms, providing a consistent, intuitive interface for travelers. The core of Odyssey is powered by **ESP32 microcontrollers** placed strategically along travel routes. These devices act as knowledge beacons, offering travelers access to locally stored information, even in remote locations without internet access. By connecting travelers to the stories of past explorers, Odyssey helps retain a sense of adventure, no matter where the journey takes them.

### Practicality of the Project
Odyssey is both practical and innovative, catering to modern travelers who seek both convenience and connection. By utilizing affordable **ESP32 microcontrollers** and the versatile **React Native** platform, Odyssey is highly scalable and accessible. The project transforms isolated journeys into communal experiences by connecting each step of the journey with the knowledge and stories of fellow travelers. Odyssey ensures that even in the most remote corners of the world, travelers are never truly alone.

### Technologies Used
- **React Native:** To develop a responsive mobile web application, providing a user-friendly interface for accessing trail information and engaging with other users.
- **ESP32 Microcontroller:** A low-cost, low-power microcontroller with WiFi and Bluetooth capabilities, forming the backbone of the distributed information system.
- **WiFi Communication:** For real-time data transmission between ESP32 microcontrollers and user devices, facilitating up-to-date information and interactions.

### Odyssey – Reconnecting Travelers with the Essence of Exploration
Odyssey is more than just a project; it’s a movement aimed at reconnecting travelers with the spirit of exploration. By fostering shared experiences and promoting serendipity, Odyssey turns each journey into an adventure filled with stories, wisdom, and the joy of discovery.

---

## Project Setup

### Prerequisites
To set up the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- ESP32 hardware and the Arduino IDE for IoT setup.

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/odyssey.git
   cd odyssey
   ```

2. **Install dependencies:**
   ```bash
   # Using npm
   npm install

   # Or using Yarn
   yarn install
   ```

3. **Running the React Native app:**

   - For Android:
     ```bash
     npx react-native run-android
     ```

4. **ESP32 Setup:**
   - Install the [Arduino IDE](https://www.arduino.cc/en/software).
   - Set up your ESP32 with WiFi and local storage capabilities.
   - Upload the necessary code to the ESP32, ensuring communication between the microcontrollers and the app.

5. **Basic Bash Commands for ESP32:**

   - Flash the code to ESP32:
     ```bash
     esptool.py --chip esp32 --port /dev/ttyUSB0 write_flash -z 0x1000 firmware.bin
     ```

   - Monitor serial output:
     ```bash
     screen /dev/ttyUSB0 115200
     ```

6. **Local Development Server (Optional):**
   If you're using a local development server:
   ```bash
   npm start
   ```

---
