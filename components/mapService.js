import MapboxGL from '@rnmapbox/maps';


export const downloadOfflineMap = async () => {
  const packName = 'MyMap';
  
  try {
    // Check if the offline pack already exists
    const existingPacks = await MapboxGL.offlineManager.getPacks();
    console.log(existingPacks);

    const existingPack = existingPacks.find(pack => pack.name === packName);
    
    if (existingPack) {
      console.log('Offline pack already exists. Skipping download.');
      return; // Skip downloading if pack exists
    }

    // If the pack does not exist, proceed to create it
    const offlinePack = {
      name: packName,
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [
        [85.338074, 27.699060], // Northeast corner
        [85.321820, 27.691127], // Southwest corner
      ],
      minZoom: 16,
      maxZoom: 20,
    };

    // Progress callback
const onProgress = (offlinePack, status) => {
  const percentage = (status.completedResourceCount / status.requiredResourceCount) * 100;
  console.log(`Download progress: ${percentage.toFixed(2)}%`);

  if (status.completedResourceCount === status.requiredResourceCount) {
    console.log('Offline map download complete');
  }
};

// Error callback
const onError = (offlinePack, error) => {
  console.log('Error downloading offline map:', error);
  alert('An error occurred while downloading the map');
};

    await MapboxGL.offlineManager.createPack(offlinePack, onProgress, onError);

    console.log('Offline map downloaded successfully!');
  } catch (error) {
    console.error('Error downloading offline map:', error);
  }
};


export const removeMap = async (packName) => {

     await MapboxGL.offlineManager.deletePack(packName);
      console.log(`Removed offline pack: ${packName}`);

      const existingPacks = await MapboxGL.offlineManager.getPacks();
    console.log(existingPacks);
  };
