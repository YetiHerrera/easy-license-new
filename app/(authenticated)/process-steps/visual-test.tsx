import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function VisualTest() {
  const { id } = useLocalSearchParams();
  const { completedProcesses, updateProcessVerificationStep } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  // Use local state for the process to ensure UI updates
  const [currentProcess, setCurrentProcess] = useState(() => {
    const process = completedProcesses.find(p => p.id === id);
    console.log('Initial process in VisualTest:', process);
    return process;
  });
  
  // Update the current process when completedProcesses changes or id changes
  useEffect(() => {
    const process = completedProcesses.find(p => p.id === id);
    console.log('Process found in useEffect:', process);
    if (process) {
      console.log('Is visual test completed?', process.visualTestCompleted);
      setCurrentProcess(process);
    }
  }, [completedProcesses, id]);
  
  // Force a refresh when component mounts
  useEffect(() => {
    // Force refresh to get the latest data
    const refreshTimer = setTimeout(() => {
      const freshProcess = completedProcesses.find(p => p.id === id);
      console.log('Refreshed process:', freshProcess);
      if (freshProcess) {
        setCurrentProcess(freshProcess);
      }
    }, 300);
    
    return () => clearTimeout(refreshTimer);
  }, []);
  
  const handleGoBack = () => {
    // Always navigate to the home screen
    router.replace('/(authenticated)/home');
  };
  
  const handleStartTests = () => {
    // Navigate to the first test (colorblind test)
    router.push({
      pathname: '/(authenticated)/process-steps/colorblind-test',
      params: { id }
    });
  };
  
  // const handleCompleteTest = async () => {
  //   if (currentProcess) {
  //     await updateProcessVerificationStep(currentProcess.id, 'visualTest', true);
  //     router.back();
  //   }
  // };

  if (!currentProcess) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>{t('process.error.notFound')}</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  console.log('Rendering VisualTest with visualTestCompleted:', currentProcess.visualTestCompleted);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('process.steps.visualTest'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
          ),
          headerShown: false,
        }}
        listeners={{
          beforeRemove: (e) => {
            e.preventDefault();
            handleGoBack();
          },
        }}
      />
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{t('process.steps.visualTest')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.description, { color: theme.text }]}>
          {t('process.visualTest.description')}
        </Text>
        
        <View style={[styles.infoBox, { backgroundColor: theme.formInputBackground }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>{t('process.visualTest.beforeBegin')}</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={[styles.infoText, { color: theme.text }]}>
              {t('process.visualTest.holdPhone')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={[styles.infoText, { color: theme.text }]}>
              {t('process.visualTest.wellLit')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={[styles.infoText, { color: theme.text }]}>
              {t('process.visualTest.wearGlasses')}
            </Text>
          </View>
        </View>
        
        <View style={[styles.infoBox, { backgroundColor: theme.formInputBackground }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>{t('process.visualTest.threeTests')}</Text>
          <View style={styles.testInfo}>
            <View style={styles.testNumberCircle}>
              <Text style={styles.testNumber}>1</Text>
            </View>
            <View style={styles.testDescription}>
              <Text style={[styles.testTitle, { color: theme.text }]}>{t('process.visualTest.colorblind.title')}</Text>
              <Text style={[styles.infoText, { color: theme.text }]}>
                {t('process.visualTest.colorblind.description')}
              </Text>
            </View>
          </View>
          
          <View style={styles.testInfo}>
            <View style={styles.testNumberCircle}>
              <Text style={styles.testNumber}>2</Text>
            </View>
            <View style={styles.testDescription}>
              <Text style={[styles.testTitle, { color: theme.text }]}>{t('process.visualTest.depthPerception.title')}</Text>
              <Text style={[styles.infoText, { color: theme.text }]}>
                {t('process.visualTest.depthPerception.description')}
              </Text>
            </View>
          </View>
          
          <View style={styles.testInfo}>
            <View style={styles.testNumberCircle}>
              <Text style={styles.testNumber}>3</Text>
            </View>
            <View style={styles.testDescription}>
              <Text style={[styles.testTitle, { color: theme.text }]}>{t('process.visualTest.myopia.title')}</Text>
              <Text style={[styles.infoText, { color: theme.text }]}>
                {t('process.visualTest.myopia.description')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.referenceContainer}>
          <Text style={[styles.referenceLabel, { color: theme.text }]}>
            {t('process.referenceNumber')}:
          </Text>
          <Text style={[styles.referenceValue, { color: theme.text }]}>
            {currentProcess.id}
          </Text>
        </View>
        
        {!currentProcess.visualTestCompleted && (
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: theme.primary }]}
            onPress={handleStartTests}
          >
            <Text style={styles.startButtonText}>{t('process.visualTest.startTests')}</Text>
          </TouchableOpacity>
        )}
        
        {currentProcess.visualTestCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: '#34C759' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completedText}>{t('process.visualTest.testsCompleted')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  centerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  testInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  testNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  testNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testDescription: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  referenceContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  referenceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    gap: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
}); 