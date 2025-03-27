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

type PhotoType = 'front' | 'back';

interface LicensePhoto {
  type: PhotoType;
  imageUri?: string;
}

export default function LicenseUpload() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const [licensePhotos, setLicensePhotos] = useState<LicensePhoto[]>([
    { type: 'front' },
    { type: 'back' }
  ]);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const handleLicenseCapture = async (photoType: PhotoType) => {
    if (!hasCameraPermission) {
      Alert.alert(
        t('licenseUpload.permissionRequired'),
        t('licenseUpload.cameraPermissionMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('licenseUpload.settings'), onPress: () => ImagePicker.requestCameraPermissionsAsync() }
        ]
      );
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };

    try {
      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLicensePhotos(prev => {
          return prev.map(photo => 
            photo.type === photoType 
              ? { ...photo, imageUri: result.assets[0].uri } 
              : photo
          );
        });
      }
    } catch (error) {
      console.error("Error capturing license:", error);
      Alert.alert(t('licenseUpload.error'), t('licenseUpload.captureError'));
    }
  };

  const openCamera = async (photoType: PhotoType) => {
    if (!hasCameraPermission) {
      Alert.alert(
        t('licenseUpload.permissionRequired'),
        t('licenseUpload.cameraPermissionMessage')
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLicensePhotos(prev => {
          return prev.map(photo => 
            photo.type === photoType 
              ? { ...photo, imageUri: result.assets[0].uri } 
              : photo
          );
        });
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      Alert.alert(t('licenseUpload.error'), t('licenseUpload.cameraError'));
    }
  };

  const handleActionSheet = (photoType: PhotoType) => {
    Alert.alert(
      t('licenseUpload.selectOption'),
      t('licenseUpload.captureMethod'),
      [
        { 
          text: t('licenseUpload.takePhoto'), 
          onPress: () => openCamera(photoType) 
        },
        { 
          text: t('licenseUpload.chooseFromLibrary'), 
          onPress: () => handleLicenseCapture(photoType) 
        },
        {
          text: t('common.cancel'),
          style: 'cancel'
        }
      ]
    );
  };

  const canContinueWithLicense = () => {
    return licensePhotos.every(photo => photo.imageUri);
  };

  const proceedToLiveness = () => {
    router.push('/(authenticated)/liveness-verification' as any);
  };

  const proceedWithoutLicense = () => {
    proceedToLiveness();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('licenseUpload.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
          {t('licenseUpload.title')}
        </Text>

        <Text variant="body" style={[styles.subtitle, { color: theme.text }]}>
          {t('licenseUpload.subtitle')}
        </Text>

        <View style={[styles.optionalBanner, { backgroundColor: theme.formInputBackground }]}>
          <FontAwesome name="info-circle" size={20} color={theme.secondary} />
          <Text variant="body" style={[styles.optionalText, { color: theme.text }]}>
            {t('licenseUpload.optionalDocument')}
          </Text>
        </View>

        <View style={styles.licenseSection}>
          <Text 
            variant="subtitle" 
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            {t('licenseUpload.previousLicense')}
          </Text>

          <View style={styles.photoTypeContainer}>
            {licensePhotos.map((photo) => (
              <View key={photo.type} style={styles.photoTypeSection}>
                <Text 
                  variant="body" 
                  style={[styles.photoTypeTitle, { color: theme.text }]}
                >
                  {t(`licenseUpload.${photo.type}Side`)}
                </Text>

                <Pressable 
                  style={[
                    styles.photoUploadContainer, 
                    { backgroundColor: theme.formInputBackground }
                  ]}
                  onPress={() => handleActionSheet(photo.type)}
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
                          setLicensePhotos(prev => {
                            return prev.map(p => 
                              p.type === photo.type ? { type: photo.type } : p
                            );
                          });
                        }}
                      >
                        <Text style={styles.deleteButtonText}>
                          {t('licenseUpload.delete')}
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
                        {t('licenseUpload.uploadInstructions')}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        backgroundColor: theme.background,
        borderTopColor: theme.formInputBorder 
      }]}>
        <Pressable
          style={[
            styles.primaryButton, 
            { 
              backgroundColor: canContinueWithLicense() ? theme.primary : theme.formInputBorder,
              opacity: canContinueWithLicense() ? 1 : 0.7
            }
          ]}
          onPress={() => canContinueWithLicense() && proceedToLiveness()}
          disabled={!canContinueWithLicense()}
        >
          <Text variant="button" style={styles.buttonText}>
            {t('licenseUpload.continueWithLicense')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { borderColor: theme.primary }]}
          onPress={proceedWithoutLicense}
        >
          <Text variant="button" style={[styles.secondaryButtonText, { color: theme.primary }]}>
            {t('licenseUpload.continueWithoutLicense')}
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
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  optionalBanner: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  optionalText: {
    marginLeft: 12,
    flex: 1,
  },
  licenseSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryButton: {
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
