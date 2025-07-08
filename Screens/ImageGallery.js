import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  SafeAreaView
} from 'react-native';

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 3; // 3 images per row with spacing

export default function ImageGallery({ route, navigation }) {
  const { images: initialImages, onDeleteImage } = route.params;
  const [images, setImages] = useState(initialImages);

  // Update header title with image count
  useEffect(() => {
    navigation.setOptions({
      title: `My Images (${images.length})`,
    });
  }, [images.length, navigation]);

  const handleDeleteImage = (index) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
            // Also update the parent component
            onDeleteImage(index);
          }
        }
      ]
    );
  };
  
  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onLongPress={() => handleDeleteImage(index)}
    >
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No images added yet</Text>
          <Text style={styles.emptySubtext}>Go back and upload some images!</Text>
          <TouchableOpacity 
            style={styles.backToMainButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToMainText}>Back to Main</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gridContainer: {
    padding: 15,
  },
  imageContainer: {
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: imageSize,
    height: imageSize,
    resizeMode: 'cover',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  backToMainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  backToMainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});