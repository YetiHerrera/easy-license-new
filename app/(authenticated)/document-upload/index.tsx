import { View, StyleSheet, ScrollView, Pressable, useColorScheme, Alert, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

type DocumentType = 'identity' | 'passport' | 'both';
type PhotoType = 'front' | 'back';

interface DocumentPhoto {
  type: PhotoType;
  imageUri?: string;
}

interface DocumentData {
  documentType: DocumentType;
  dpiPhotos: DocumentPhoto[];
  passportPhoto?: string;
  hasCurrentLicense: boolean;
}

export default function DocumentUpload() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [documentData, setDocumentData] = useState<DocumentData>({
    documentType: 'both',
    dpiPhotos: [
      { type: 'front' },
      { type: 'back' }
    ],
    hasCurrentLicense: false
  });
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const handleDocumentCapture = async (documentType: 'dpi' | 'passport', photoType?: PhotoType) => {
    if (!hasCameraPermission) {
      Alert.alert(
        t('documentUpload.permissionRequired'),
        t('documentUpload.cameraPermissionMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('documentUpload.settings'), onPress: () => ImagePicker.requestCameraPermissionsAsync() }
        ]
      );
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      aspect: [4, 3],
      quality: 0.8,
    };

    try {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (documentType === 'dpi' && photoType) {
          setDocumentData(prev => ({
            ...prev,
            dpiPhotos: prev.dpiPhotos.map(photo => 
              photo.type === photoType 
                ? { ...photo, imageUri: result.assets[0].uri } 
                : photo
            )
          }));
        } else if (documentType === 'passport') {
          setDocumentData(prev => ({
            ...prev,
            passportPhoto: result.assets[0].uri
          }));
        }
      }
    } catch (error) {
      console.error("Error capturing document:", error);
      Alert.alert(t('documentUpload.error'), t('documentUpload.captureError'));
    }
  };

  const openCamera = async (documentType: 'dpi' | 'passport', photoType?: PhotoType) => {
    if (!hasCameraPermission) {
      Alert.alert(
        t('documentUpload.permissionRequired'),
        t('documentUpload.cameraPermissionMessage')
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (documentType === 'dpi' && photoType) {
          setDocumentData(prev => ({
            ...prev,
            dpiPhotos: prev.dpiPhotos.map(photo => 
              photo.type === photoType 
                ? { ...photo, imageUri: result.assets[0].uri } 
                : photo
            )
          }));
        } else if (documentType === 'passport') {
          setDocumentData(prev => ({
            ...prev,
            passportPhoto: result.assets[0].uri
          }));
        }
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      Alert.alert(t('documentUpload.error'), t('documentUpload.cameraError'));
    }
  };

  const handleActionSheet = (documentType: 'dpi' | 'passport', photoType?: PhotoType) => {
    Alert.alert(
      t('documentUpload.selectOption'),
      t('documentUpload.captureMethod'),
      [
        { 
          text: t('documentUpload.takePhoto'), 
          onPress: () => openCamera(documentType, photoType) 
        },
        { 
          text: t('documentUpload.chooseFromLibrary'), 
          onPress: () => handleDocumentCapture(documentType, photoType) 
        },
        {
          text: t('common.cancel'),
          style: 'cancel'
        }
      ]
    );
  };

  const selectDocumentType = (type: DocumentType) => {
    setDocumentData(prev => ({
      ...prev,
      documentType: type
    }));
  };

  const toggleLicenseOption = () => {
    setDocumentData(prev => ({
      ...prev,
      hasCurrentLicense: !prev.hasCurrentLicense
    }));
  };
  
  const canContinue = () => {
    const { documentType, dpiPhotos, passportPhoto } = documentData;
    
    if (documentType === 'identity') {
      return dpiPhotos.every(photo => photo.imageUri);
    } else if (documentType === 'passport') {
      return !!passportPhoto;
    } else {
      // If both, then we need both DPI photos and passport photo
      return dpiPhotos.every(photo => photo.imageUri) && !!passportPhoto;
    }
  };

  const handleSubmit = () => {
    if (canContinue()) {
      router.push('/(authenticated)/license-upload' as any);
    }
  };

  const renderDocumentSelector = () => {
    const { documentType } = documentData;
    
    return (
      <View style={styles.selectorContainer}>
        <Text 
          variant="subtitle" 
          style={[styles.selectorTitle, { color: theme.text }]}
        >
          {t('documentUpload.subtitle')}
        </Text>
        
        <View style={styles.buttonGroup}>
          <Pressable 
            style={[
              styles.selectorButton, 
              { 
                backgroundColor: documentType === 'identity' 
                  ? theme.primary 
                  : theme.formInputBackground 
              }
            ]}
            onPress={() => selectDocumentType('identity')}
          >
            <Text 
              variant="button" 
              style={[
                styles.selectorButtonText, 
                { color: documentType === 'identity' ? '#fff' : theme.text }
              ]}
            >
              {t('documentUpload.dpi')}
            </Text>
          </Pressable>
          
          <Pressable 
            style={[
              styles.selectorButton, 
              { 
                backgroundColor: documentType === 'passport' 
                  ? theme.primary 
                  : theme.formInputBackground 
              }
            ]}
            onPress={() => selectDocumentType('passport')}
          >
            <Text 
              variant="button" 
              style={[
                styles.selectorButtonText, 
                { color: documentType === 'passport' ? '#fff' : theme.text }
              ]}
            >
              {t('documentUpload.passport')}
            </Text>
          </Pressable>
        </View>
        
        <Pressable 
          style={[
            styles.bothButton, 
            { 
              backgroundColor: documentType === 'both' 
                ? theme.primary 
                : theme.formInputBackground 
            }
          ]}
          onPress={() => selectDocumentType('both')}
        >
          <Text 
            variant="button" 
            style={[
              styles.selectorButtonText, 
              { color: documentType === 'both' ? '#fff' : theme.text }
            ]}
          >
            {t('documentUpload.bothDocuments')}
          </Text>
          <Text 
            variant="caption" 
            style={[
              styles.recommendedText, 
              { color: documentType === 'both' ? '#fff' : theme.icon }
            ]}
          >
            {t('documentUpload.recommended')}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderDPISection = () => {
    const { dpiPhotos } = documentData;
    
    return (
      <View style={styles.documentSection}>
        <Text 
          variant="subtitle" 
          style={[styles.documentSectionTitle, { color: theme.text }]}
        >
          {t('documentUpload.dpi')}
        </Text>
        <Text 
          variant="caption" 
          style={[styles.documentSectionSubtitle, { color: theme.text }]}
        >
          {t('documentUpload.dpiFullName')}
        </Text>
        
        <View style={styles.photoTypeContainer}>
          {dpiPhotos.map((photo) => (
            <View key={photo.type} style={styles.photoTypeSection}>
              <Text 
                variant="body" 
                style={[styles.photoTypeTitle, { color: theme.text }]}
              >
                {t(`documentUpload.${photo.type}Side`)}
              </Text>
              
              <Pressable 
                style={[
                  styles.photoUploadContainer, 
                  { backgroundColor: theme.formInputBackground }
                ]}
                onPress={() => handleActionSheet('dpi', photo.type)}
              >
                {photo.imageUri ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image 
                      source={{ uri: photo.imageUri }} 
                      style={styles.photoPreview} 
                      resizeMode="cover"
                    />
                    <Pressable 
                      style={styles.deleteButton}
                      onPress={() => {
                        setDocumentData(prev => ({
                          ...prev,
                          dpiPhotos: prev.dpiPhotos.map(p => 
                            p.type === photo.type ? { type: photo.type } : p
                          )
                        }));
                      }}
                    >
                      <Text style={styles.deleteButtonText}>
                        {t('documentUpload.delete')}
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <MaterialIcons name="add-a-photo" size={40} color={theme.icon} />
                    <Text 
                      variant="caption" 
                      style={[styles.uploadInstructions, { color: theme.icon }]}
                    >
                      {t('documentUpload.uploadInstructions')}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPassportSection = () => {
    const { passportPhoto } = documentData;
    
    return (
      <View style={styles.documentSection}>
        <Text 
          variant="subtitle" 
          style={[styles.documentSectionTitle, { color: theme.text }]}
        >
          {t('documentUpload.passport')}
        </Text>
        
        <Pressable 
          style={[
            styles.photoUploadContainer, 
            { backgroundColor: theme.formInputBackground }
          ]}
          onPress={() => handleActionSheet('passport')}
        >
          {passportPhoto ? (
            <View style={styles.photoPreviewContainer}>
              <Image 
                source={{ uri: passportPhoto }} 
                style={styles.photoPreview} 
                resizeMode="cover"
              />
              <Pressable 
                style={styles.deleteButton}
                onPress={() => {
                  setDocumentData(prev => ({
                    ...prev,
                    passportPhoto: undefined
                  }));
                }}
              >
                <Text style={styles.deleteButtonText}>
                  {t('documentUpload.delete')}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="add-a-photo" size={40} color={theme.icon} />
              <Text 
                variant="caption" 
                style={[styles.uploadInstructions, { color: theme.icon }]}
              >
                {t('documentUpload.uploadInstructions')}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('documentUpload.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
          {t('documentUpload.documentTypeSelector')}
        </Text>
        
        {renderDocumentSelector()}
        
        <View style={styles.documentsContainer}>
          {(documentData.documentType === 'identity' || documentData.documentType === 'both') && 
            renderDPISection()
          }
          
          {(documentData.documentType === 'passport' || documentData.documentType === 'both') && 
            renderPassportSection()
          }
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        backgroundColor: theme.background,
        borderTopColor: theme.formInputBorder 
      }]}>
        <Pressable
          style={[
            styles.button, 
            { 
              backgroundColor: canContinue() ? theme.primary : theme.formInputBorder,
              opacity: canContinue() ? 1 : 0.7
            }
          ]}
          onPress={handleSubmit}
          disabled={!canContinue()}
        >
          <Text variant="button" style={styles.buttonText}>
            {t('documentUpload.continue')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 42,
    marginBottom: 16,
  },
  selectorContainer: {
    marginBottom: 24,
  },
  selectorTitle: {
    marginBottom: 12,
    fontSize: 13,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectorButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bothButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  recommendedText: {
    fontSize: 12,
    marginTop: 4,
  },
  documentsContainer: {
    gap: 24,
  },
  documentSection: {
    marginBottom: 24,
  },
  documentSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentSectionSubtitle: {
    marginBottom: 16,
  },
  photoTypeContainer: {
    gap: 20,
  },
  photoTypeSection: {
    marginBottom: 8,
  },
  photoTypeTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  photoUploadContainer: {
    borderRadius: 12,
    height: 200,
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  uploadInstructions: {
    marginTop: 12,
    textAlign: 'center',
  },
  photoPreviewContainer: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  photoPreview: {
    height: '100%',
    width: '100%',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  licenseQuestion: {
    borderRadius: 12,
    padding: 16,
  },
  licenseQuestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 