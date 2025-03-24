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
  
  const handleCompleteTest = async () => {
    if (process) {
      await updateProcessVerificationStep(process.id, 'visualTest', true);
      router.back();
    }
  };

  if (!process) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Process not found</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>Go Back</Text>
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
          Your visual test needs to be conducted at an authorized testing center. Please visit one of our centers to proceed.
        </Text>
        
        <View style={[styles.infoBox, { backgroundColor: theme.formInputBackground }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>Testing Centers</Text>
          <View style={styles.centerInfo}>
            <MaterialIcons name="location-on" size={20} color={theme.text} />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Central Vision Testing Facility
            </Text>
          </View>
          <View style={styles.centerInfo}>
            <MaterialIcons name="access-time" size={20} color={theme.text} />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Mon-Fri: 9:00 AM - 5:00 PM
            </Text>
          </View>
          <View style={styles.centerInfo}>
            <MaterialIcons name="phone" size={20} color={theme.text} />
            <Text style={[styles.infoText, { color: theme.text }]}>
              +502 2345-6789
            </Text>
          </View>
        </View>
        
        <View style={[styles.infoBox, { backgroundColor: theme.formInputBackground }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>What to Bring</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Original DPI or Passport
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Process Reference Number
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Any prescription glasses if you wear them
            </Text>
          </View>
        </View>
        
        <View style={styles.referenceContainer}>
          <Text style={[styles.referenceLabel, { color: theme.text }]}>
            Process Reference Number:
          </Text>
          <Text style={[styles.referenceValue, { color: theme.text }]}>
            {process.id}
          </Text>
        </View>
        
        {!process.visualTestCompleted && (
          <View style={[styles.statusBadge, { backgroundColor: theme.formInputBackground }]}>
            <MaterialIcons name="schedule" size={20} color={theme.primary} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              Pending Visual Test
            </Text>
          </View>
        )}
        
        {process.visualTestCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: '#34C759' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completedText}>Test Completed</Text>
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