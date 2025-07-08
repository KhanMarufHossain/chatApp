import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ImageGallery from './ImageGallery';

export default function Modale() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  const handleUploadFromComputer = async () => {
    setModalVisible(false);
    
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access photos");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleUploadFromCamera = () => {
    Alert.alert('Open Camera', 'Camera functionality coming soon!');
    setModalVisible(false);
  };

  const handleDeleteImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleViewGallery = () => {
    setShowGallery(true);
  };

  if (showGallery) {
    return (
      <ImageGallery 
        images={selectedImages}
        onDeleteImage={handleDeleteImage}
        onBack={() => setShowGallery(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
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
              <Text style={styles.optionText}>📁 Upload from Computer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={handleUploadFromCamera}
            >
              <Text style={styles.optionText}>📸 Open Camera</Text>
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

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
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