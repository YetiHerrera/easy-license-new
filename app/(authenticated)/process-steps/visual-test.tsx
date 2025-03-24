import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function VisualTest() {
  const { id } = useLocalSearchParams();
  const { completedProcesses, updateProcessVerificationStep } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  // Find the process by ID
  const process = completedProcesses.find(p => p.id === id);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleStartTests = () => {
    // Navigate to the first test (colorblind test)
    router.push({
      pathname: '/(authenticated)/process-steps/colorblind-test',
      params: { id }
    });
  };
  
  const handleCompleteTest = async () => {
    if (process) {
      await updateProcessVerificationStep(process.id, 'visualTest', true);
      router.back();
    }
  };

  if (!process) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>{t('process.error.notFound')}</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
            {process.id}
          </Text>
        </View>
        
        {!process.visualTestCompleted && (
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: theme.primary }]}
            onPress={handleStartTests}
          >
            <Text style={styles.startButtonText}>{t('process.visualTest.startTests')}</Text>
          </TouchableOpacity>
        )}
        
        {process.visualTestCompleted && (
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