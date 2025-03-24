import { View, StyleSheet, useColorScheme, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type ProcessType = 'renewal' | 'replacement';

export default function ProcessType() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [selectedProcesses, setSelectedProcesses] = useState<ProcessType[]>([]);

  const handleProcessSelection = (process: ProcessType) => {
    setSelectedProcesses(prev => {
      if (prev.includes(process)) {
        return prev.filter(p => p !== process);
      } else {
        return [...prev, process];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedProcesses.length > 0) {
      router.push('/(authenticated)/process-review/process-resume' as any);
    }
  };

  const isFormValid = () => {
    return selectedProcesses.length > 0;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('processType.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
              {t('processType.title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              {t('processType.subtitle')}
            </Text>
            
            <View style={styles.optionsContainer}>
              <Pressable
                style={[
                  styles.optionCard,
                  { 
                    backgroundColor: theme.formInputBackground,
                    borderColor: selectedProcesses.includes('renewal') ? theme.primary : theme.formInputBorder,
                    borderWidth: selectedProcesses.includes('renewal') ? 2 : 1,
                  }
                ]}
                onPress={() => handleProcessSelection('renewal')}
              >
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: theme.success + '20' }
                ]}>
                  <Ionicons 
                    name="add-circle" 
                    size={24} 
                    color={theme.success} 
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>
                    {t('processType.renewal')}
                  </Text>
                  <Text style={[styles.optionDescription, { color: theme.text }]}>
                    {t('processType.renewalDescription')}
                  </Text>
                </View>
                <View style={[
                  styles.checkBox, 
                  { 
                    borderColor: selectedProcesses.includes('renewal') ? theme.primary : theme.formInputBorder,
                    backgroundColor: selectedProcesses.includes('renewal') ? theme.primary : 'transparent',
                  }
                ]}>
                  {selectedProcesses.includes('renewal') && (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </View>
              </Pressable>

              <Pressable
                style={[
                  styles.optionCard,
                  { 
                    backgroundColor: theme.formInputBackground,
                    borderColor: selectedProcesses.includes('replacement') ? theme.primary : theme.formInputBorder,
                    borderWidth: selectedProcesses.includes('replacement') ? 2 : 1,
                  }
                ]}
                onPress={() => handleProcessSelection('replacement')}
              >
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: theme.primary + '20' }
                ]}>
                  <MaterialCommunityIcons 
                    name="folder-cog" 
                    size={24} 
                    color={theme.primary} 
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>
                    {t('processType.replacement')}
                  </Text>
                  <Text style={[styles.optionDescription, { color: theme.text }]}>
                    {t('processType.replacementDescription')}
                  </Text>
                </View>
                <View style={[
                  styles.checkBox, 
                  { 
                    borderColor: selectedProcesses.includes('replacement') ? theme.primary : theme.formInputBorder,
                    backgroundColor: selectedProcesses.includes('replacement') ? theme.primary : 'transparent',
                  }
                ]}>
                  {selectedProcesses.includes('replacement') && (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.submitButton, 
              { 
                backgroundColor: isFormValid() ? theme.primary : theme.formInputBackgroundDisabled,
                opacity: isFormValid() ? 1 : 0.5,
              }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid()}
          >
            <Text style={[
              styles.submitButtonText,
              { color: isFormValid() ? '#FFFFFF' : theme.text }
            ]}>
              {t('common.continue')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 