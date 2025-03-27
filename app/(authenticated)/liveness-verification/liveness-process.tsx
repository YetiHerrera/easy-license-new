import { View, StyleSheet, useColorScheme, Pressable, Image, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useData } from '@/contexts/DataContext';

// Define possible states for the verification process
type VerificationState = 'initial' | 'recording' | 'completed' | 'verified';

export default function LivenessProcess() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  const { completedProcesses, updateProcessVerificationStep } = useData();
  const [permission, requestPermission] = useCameraPermissions();
  const [verificationState, setVerificationState] = useState<VerificationState>('initial');
  const cameraRef = useRef(null);

  const startRecording = async () => {
    if (cameraRef.current && verificationState === 'initial') {
      setVerificationState('recording');
      try {
        // Start recording would go here in an actual implementation
        // with the correct ref method
        console.log('Recording started');
      } catch (error) {
        console.error('Error recording video:', error);
        setVerificationState('initial');
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && verificationState === 'recording') {
      // Stop recording would go here in an actual implementation
      console.log('Recording stopped');
      setVerificationState('completed');
      // Automatically submit verification after stopping recording
      submitVerification();
    }
  };

  const submitVerification = async () => {
    // This would submit the verification to a backend service
    setVerificationState('verified');

    // In a real implementation, you would wait for a response from the server
    // before navigating away or showing success
    setTimeout(async () => {
      try {
        // Get the first process (assuming it's the active one)
        if (completedProcesses && completedProcesses.length > 0) {
          const process = completedProcesses[0];

          // Update the document verification step to completed
          await updateProcessVerificationStep(process.id, 'documentVerification', true);

          // Show success message and navigate back to home
          Alert.alert(
            t('livenessVerification.successTitle') || 'Verification Complete',
            t('livenessVerification.successMessage') || 'Your documents have been successfully verified.',
            [
              {
                text: t('common.ok') || 'OK',
                onPress: () => router.replace('/(authenticated)/home' as any),
              },
            ]
          );
        } else {
          // If no process is found, just navigate back to home
          router.replace('/(authenticated)/home' as any);
        }
      } catch (error) {
        console.error('Error updating document verification status:', error);
        router.replace('/(authenticated)/home' as any);
      }
    }, 3000);
  };

  const handleButtonPress = () => {
    switch (verificationState) {
      case 'initial':
        startRecording();
        break;
      case 'recording':
        stopRecording();
        break;
      default:
        break;
    }
  };

  // Get button text based on verification state
  const getButtonText = () => {
    switch (verificationState) {
      case 'initial':
        return t('livenessVerification.startRecording');
      case 'recording':
        return t('livenessVerification.finishRecording');
      case 'verified':
        return t('livenessVerification.verificationComplete');
      default:
        return t('livenessVerification.startRecording');
    }
  };

  // Get button style based on verification state
  const getButtonStyle = () => {
    switch (verificationState) {
      case 'recording':
        return styles.recordingButton;
      case 'verified':
        return styles.verifiedButton;
      default:
        return styles.initialButton;
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text>{t('documentUpload.cameraPermissionMessage')}</Text>
        <Pressable 
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={requestPermission}
        >
          <Text variant="button" style={styles.buttonText}>{t('documentUpload.settings')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'black' }]}>
      <Stack.Screen
        options={{
          title: t('livenessVerification.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.header}>
        <Text variant="title" style={styles.headerTitle}>
          {t('livenessVerification.title')}
        </Text>
        <Text variant="body" style={styles.headerSubtitle}>
          {t('livenessVerification.subtitle')}
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            mode="video"
          >
            <View style={styles.faceBorder} />
            {verificationState === 'recording' && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>REC</Text>
              </View>
            )}
          </CameraView>

          {verificationState === 'verified' && (
            <View style={styles.successOverlay}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark" size={80} color="white" />
              </View>
              <Text style={styles.successText}>{t('livenessVerification.verificationComplete')}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.instructions}>
        {verificationState !== 'verified' ? (
          <>
            <Text variant="body" style={styles.instructionsText}>
              {t('livenessVerification.instruction2')}
            </Text>
            <Text variant="body" style={[styles.instructionsText, styles.instructionSpacing, styles.highLight]}>
              {t('livenessVerification.showDocument')}
            </Text>
            <Text variant="body" style={[styles.instructionsText, styles.instructionSpacing, styles.emphasis]}>
              {t('livenessVerification.moveHeadSideToSide')}
            </Text>
          </>
        ) : (
          <Text variant="body" style={[styles.instructionsText, styles.successMessage]}>
            {t('livenessVerification.verificationSuccessMessage')}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.actionButton, getButtonStyle()]} 
          onPress={handleButtonPress}
          disabled={verificationState === 'verified'}
        >
          {verificationState === 'initial' && (
            <Ionicons name="videocam" size={24} color="white" style={styles.buttonIcon} />
          )}
          {verificationState === 'recording' && (
            <Ionicons name="stop-circle" size={24} color="white" style={styles.buttonIcon} />
          )}
          {verificationState === 'verified' && (
            <Ionicons name="checkmark-done-circle" size={24} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.actionButtonText}>
            {getButtonText()}
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
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  cameraWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 200,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  faceBorder: {
    width: '90%',
    height: '90%',
    borderWidth: 8,
    borderColor: 'white',
    borderRadius: 500,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(67, 160, 71, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructions: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  instructionsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  instructionSpacing: {
    marginTop: 5,
  },
  highLight: {
    color: '#FFD700',
    fontWeight: '600',
  },
  emphasis: {
    color: '#00BFFF',
    fontWeight: '600',
  },
  successMessage: {
    color: '#43A047',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  initialButton: {
    backgroundColor: '#304FFE',
  },
  recordingButton: {
    backgroundColor: '#E53935',
  },
  verifiedButton: {
    backgroundColor: '#43A047',
    opacity: 0.7,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 10,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 5,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
