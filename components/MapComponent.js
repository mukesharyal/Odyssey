import MapboxGL from '@rnmapbox/maps';


const MapComponent = ({videos}) => {

  return (
    <MapboxGL.MapView style={{ flex: 1 }}>
      <MapboxGL.Camera
        centerCoordinate={[85.329684, 27.695222]} // Set your initial center
        zoomLevel={16} // Set initial zoom level to 16
        minZoomLevel={17} // Minimum zoom level
        maxZoomLevel={20} // Maximum zoom level // Adjust as necessary
      />
      <MapboxGL.UserLocation />

      {videos && videos.map((video, index) => (
        <MapboxGL.PointAnnotation
          key={index.toString()} // Use index as a key, or you can use a unique identifier if available
          id={`marker-${index}`} // Unique id for each marker
          coordinate={[video.longitude, video.latitude]} // Using longitude and latitude from your object
        >
          <MapboxGL.Callout title={video.userName} />

        </MapboxGL.PointAnnotation>
      ))}

      

    </MapboxGL.MapView>
  );
};

export default MapComponent;

