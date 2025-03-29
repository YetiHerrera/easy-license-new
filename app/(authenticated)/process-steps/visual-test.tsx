import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, StatusBar, ScrollView, Animated, BackHandler, Platform } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

export default function VisualTest() {
  const { id } = useLocalSearchParams();
  const { completedProcesses } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  // State for accordions
  const [testsExpanded, setTestsExpanded] = useState(false);
  const [instructionsExpanded, setInstructionsExpanded] = useState(true); // Start expanded
  const testsAnimatedValue = useRef(new Animated.Value(0)).current;
  const instructionsAnimatedValue = useRef(new Animated.Value(1)).current; // Start expanded

  // Toggle tests accordion
  const toggleTestsAccordion = () => {
    const toValue = testsExpanded ? 0 : 1;
    Animated.timing(testsAnimatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setTestsExpanded(!testsExpanded);
  };

  // Toggle instructions accordion
  const toggleInstructionsAccordion = () => {
    const toValue = instructionsExpanded ? 0 : 1;
    Animated.timing(instructionsAnimatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setInstructionsExpanded(!instructionsExpanded);
  };

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

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleGoBack();
        return true; // Prevent default behavior
      });

      return () => backHandler.remove();
    }
  }, []);

  const handleGoBack = () => {
    // Always navigate to the home screen
    router.replace('/(authenticated)/home');
  };

  const handleStartTests = () => {
    // Only allow starting tests if not completed
    if (!currentProcess?.visualTestCompleted) {
      router.push({
        pathname: '/(authenticated)/process-steps/colorblind-test',
        params: { id }
      });
    }
  };

  // Calculate test results summary if tests are completed
  const getTestResultsSummary = () => {
    if (!currentProcess?.testResults) return null;

    const results = currentProcess.testResults;
    const summary = {
      totalPassed: 0,
      total: 0
    };

    if (results.colorblind) {
      summary.total++;
      if (results.colorblind.passed) summary.totalPassed++;
    }
    if (results.depthPerception) {
      summary.total++;
      if (results.depthPerception.passed) summary.totalPassed++;
    }
    if (results.myopia) {
      summary.total++;
      if (results.myopia.passed) summary.totalPassed++;
    }

    return summary;
  };

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

  const testResults = getTestResultsSummary();
  const isCompleted = currentProcess.visualTestCompleted;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('process.steps.visualTest'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          gestureEnabled: false,
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
          {isCompleted 
            ? t('process.visualTest.completedDescription')
            : t('process.visualTest.description')}
        </Text>

        {isCompleted ? (
          <View style={[styles.completedContainer, { backgroundColor: theme.formInputBackground }]}>
            {testResults ? (
              <>
                {testResults.totalPassed === testResults.total ? (
                  <View style={[styles.completedBadge, { backgroundColor: '#34C759' }]}>
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.completedText}>{t('process.visualTest.completed')}</Text>
                  </View>
                ) : (
                  <View style={[styles.completedBadge, { backgroundColor: '#FF9500' }]}>
                    <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.completedText}>{t('process.visualTest.underReview')}</Text>
                  </View>
                )}

                <View style={styles.resultsContainer}>
                  <Text style={[styles.resultsTitle, { color: theme.text }]}>
                    {t('process.visualTest.testResults')}
                  </Text>
                  <Text style={[styles.resultsText, { color: theme.text }]}>
                    {t('process.visualTest.testsPassed', { 
                      passed: testResults.totalPassed,
                      total: testResults.total 
                    })}
                  </Text>

                  {testResults.totalPassed < testResults.total && (
                    <Text style={[styles.reviewNote, { color: theme.text }]}>
                      {t('process.visualTest.reviewNote')}
                    </Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={[styles.homeButton, { backgroundColor: theme.primary }]}
                  onPress={() => router.replace('/(authenticated)/home')}
                >
                  <Ionicons name="home" size={24} color="#FFFFFF" />
                  <Text style={styles.homeButtonText}>{t('common.goBackToHome')}</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        ) : (
          <>
            <View style={[styles.infoBox, styles.instructionsBox, { backgroundColor: theme.formInputBackground }]}>
              <TouchableOpacity 
                style={styles.accordionHeader} 
                onPress={toggleInstructionsAccordion}
                activeOpacity={0.7}
              >
                <Text style={[styles.infoTitle, styles.instructionsTitle, { color: theme.text }]}>
                  {t('process.visualTest.beforeBegin')}
                </Text>
                <AntDesign 
                  name={instructionsExpanded ? "up" : "down"} 
                  size={20} 
                  color={theme.text} 
                  style={styles.accordionIcon}
                />
              </TouchableOpacity>

              <Animated.View 
                style={[
                  styles.accordionContent,
                  {
                    maxHeight: instructionsAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 300]
                    }),
                    opacity: instructionsAnimatedValue
                  }
                ]}
              >
                <View style={styles.instructionsContent}>
                  <View style={styles.infoItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={[styles.infoText, styles.instructionText, { color: theme.text }]}>
                      {t('process.visualTest.holdPhone')}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={[styles.infoText, styles.instructionText, { color: theme.text }]}>
                      {t('process.visualTest.wellLit')}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={[styles.infoText, styles.instructionText, { color: theme.text }]}>
                      {t('process.visualTest.wearGlasses')}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.formInputBackground }]}>
              <TouchableOpacity 
                style={styles.accordionHeader} 
                onPress={toggleTestsAccordion}
                activeOpacity={0.7}
              >
                <Text style={[styles.infoTitle, { color: theme.text }]}>
                  {t('process.visualTest.threeTests')}
                </Text>
                <AntDesign 
                  name={testsExpanded ? "up" : "down"} 
                  size={20} 
                  color={theme.text} 
                  style={styles.accordionIcon}
                />
              </TouchableOpacity>

              <Animated.View 
                style={[
                  styles.accordionContent,
                  {
                    maxHeight: testsAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 500]
                    }),
                    opacity: testsAnimatedValue
                  }
                ]}
              >
                <View style={styles.testInfo}>
                  <View style={styles.testNumberCircle}>
                    <Text style={styles.testNumber}>1</Text>
                  </View>
                  <View style={styles.testDescription}>
                    <Text style={[styles.testTitle, { color: theme.text }]}>
                      {t('process.visualTest.colorblind.title')}
                    </Text>
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
                    <Text style={[styles.testTitle, { color: theme.text }]}>
                      {t('process.visualTest.depthPerception.title')}
                    </Text>
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
                    <Text style={[styles.testTitle, { color: theme.text }]}>
                      {t('process.visualTest.myopia.title')}
                    </Text>
                    <Text style={[styles.infoText, { color: theme.text }]}>
                      {t('process.visualTest.myopia.description')}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: theme.primary }]}
              onPress={handleStartTests}
            >
              <Ionicons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>{t('process.visualTest.startTests')}</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.referenceContainer}>
          <Text style={[styles.referenceLabel, { color: theme.text }]}>
            {t('process.referenceNumber')}:
          </Text>
          <Text style={[styles.referenceValue, { color: theme.text }]}>
            {currentProcess.id}
          </Text>
        </View>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    marginBottom: 20,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  instructionsBox: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
    paddingLeft: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    color: '#34C759',
    flex: 1,
  },
  instructionsContent: {
    marginLeft: 4,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
    flex: 1,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  accordionIcon: {
    padding: 4,
  },
  accordionContent: {
    overflow: 'hidden',
    paddingTop: 8,
  },
  centerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
    width: '100%',
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
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 3,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  completedContainer: {
    padding: 28,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultsText: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
  },
  reviewNote: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 
