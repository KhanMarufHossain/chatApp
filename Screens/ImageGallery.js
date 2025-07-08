import React from 'react';
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

export default function ImageGallery({ images, onDeleteImage, onBack }) {
  
  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onLongPress={() => {
        Alert.alert(
          'Delete Image',
          'Are you sure you want to delete this image?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDeleteImage(index) }
          ]
        );
      }}
    >
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Images ({images.length})</Text>
        <View style={styles.placeholder} />
      </View>

      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No images added yet</Text>
          <Text style={styles.emptySubtext}>Tap the upload button to add images</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50, // Same width as back button for centering
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
  },
});