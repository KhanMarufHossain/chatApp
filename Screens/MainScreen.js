import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  Alert,
  SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function MainScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleUploadFromComputer = async () => {
    setModalVisible(false);
    
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access photos");
      return;
    }

    // Launch image picker - FIX THE DEPRECATION WARNING HERE
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images', // Use string instead of ImagePicker.MediaType.Images
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Add the selected image to the array
      const newImageUri = result.assets[0].uri;
      setSelectedImages(prevImages => [...prevImages, newImageUri]);
      console.log('Image added:', newImageUri);
      Alert.alert('Success', 'Image added to gallery!');
    }
  };

  const handleUploadFromCamera = async () => {
    console.log("Camera button pressed");
    setModalVisible(false);
    
    try {
      // Request camera permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Camera permission result:", permissionResult);
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to grant camera permission");
        return;
      }

      // Launch camera - Use string instead of MediaType enum
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images', // Use string instead of ImagePicker.MediaType.Images
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Camera result:", result);

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setSelectedImages(prevImages => [...prevImages, newImageUri]);
        console.log('Camera image added:', newImageUri);
        Alert.alert('Success', 'Image captured and added to gallery!');
      } else {
        console.log("Camera was canceled");
      }
    } catch (error) {
      console.log("Camera error:", error);
      Alert.alert("Error", "Failed to open camera: " + error.message);
    }
  };

  const handleDeleteImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleViewGallery = () => {
    navigation.navigate('Gallery', {
      images: selectedImages,
      onDeleteImage: handleDeleteImage,
    });
  };

  // Listen for updates from Gallery screen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen is focused - could update state if needed
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Image Picker</Text>
        
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <TouchableOpacity 
            style={styles.galleryButton}
            onPress={handleViewGallery}
          >
            <Text style={styles.galleryButtonText}>
              View Gallery ({selectedImages.length})
            </Text>
          </TouchableOpacity>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Upload Options</Text>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={handleUploadFromComputer}
              >
                <Text style={styles.optionText}>📁 Upload from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={handleUploadFromCamera}
              >
                <Text style={styles.optionText}>📸 Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});