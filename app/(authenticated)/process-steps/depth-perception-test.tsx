import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  useColorScheme,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions for responsive layout
const { width, height } = Dimensions.get('window');

// Test data for depth perception
// Each test contains text elements with styling to create depth perception
const depthTests = [
  {
    id: 1,
    question: 'Select the letter that appears closest to you:',
    options: [
      { text: 'A', isCloser: false },
      { text: 'B', isCloser: true },
      { text: 'C', isCloser: false },
      { text: 'D', isCloser: false }
    ]
  },
  {
    id: 2,
    question: 'Which number seems to float above the screen?',
    options: [
      { text: '3', isCloser: false },
      { text: '7', isCloser: false },
      { text: '5', isCloser: true },
      { text: '9', isCloser: false }
    ]
  },
  {
    id: 3,
    question: 'Select the symbol that appears closest to you:',
    options: [
      { text: '◯', isCloser: false },
      { text: '△', isCloser: false },
      { text: '□', isCloser: false },
      { text: '★', isCloser: true }
    ]
  }
];

export default function DepthPerceptionTest() {
  const { id } = useLocalSearchParams();
  const { completedProcesses, updateProcessVerificationStep } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(depthTests.length).fill(-1));
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentTest = depthTests[currentTestIndex];
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleOptionSelect = (index: number) => {
    setSelectedOptionIndex(index);
  };
  
  const handleNext = () => {
    if (selectedOptionIndex === null) return;
    
    // Save current answer
    const newAnswers = [...userAnswers];
    newAnswers[currentTestIndex] = selectedOptionIndex;
    setUserAnswers(newAnswers);
    
    if (currentTestIndex < depthTests.length - 1) {
      // Move to next test
      setCurrentTestIndex(currentTestIndex + 1);
      setSelectedOptionIndex(null);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter(
        (answer, index) => {
          if (answer === -1) return false;
          return depthTests[index].options[answer].isCloser;
        }
      ).length;
      
      setScore(correctAnswers);
      setTestCompleted(true);
      
      // Save progress to context
      if (id) {
        // Using 'visualTest' as the verification step since that's what's defined in the context
        updateProcessVerificationStep(id.toString(), 'visualTest', true);
      }
    }
  };
  
  const handleNextTest = () => {
    // Navigate to the next test (myopia test)
    // This will be implemented later
    router.back(); // For now, just go back
  };
  
  const handleSkip = () => {
    Alert.alert(
      t('process.visualTest.skipTitle'),
      t('process.visualTest.skipConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('process.visualTest.skip'),
          onPress: () => {
            const newAnswers = [...userAnswers];
            newAnswers[currentTestIndex] = -1; // -1 indicates skipped
            setUserAnswers(newAnswers);
            
            if (currentTestIndex < depthTests.length - 1) {
              setCurrentTestIndex(currentTestIndex + 1);
              setSelectedOptionIndex(null);
            } else {
              // Calculate score with skipped answers
              const correctAnswers = newAnswers.filter(
                (answer, index) => {
                  if (answer === -1) return false;
                  return depthTests[index].options[answer].isCloser;
                }
              ).length;
              
              setScore(correctAnswers);
              setTestCompleted(true);
              
              // Save progress to context
              if (id) {
                updateProcessVerificationStep(id.toString(), 'visualTest', true);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {testCompleted 
            ? t('process.visualTest.depthPerception.results') 
            : t('process.visualTest.depthPerception.title')}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.formInputBackground }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${testCompleted ? 100 : (currentTestIndex / depthTests.length) * 100}%`,
                backgroundColor: theme.primary 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.text }]}>
          {testCompleted 
            ? t('process.visualTest.completed') 
            : `${currentTestIndex + 1}/${depthTests.length}`}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!testCompleted ? (
          <>
            <Text style={[styles.description, { color: theme.text }]}>
              {currentTest.question}
            </Text>
            
            <View style={styles.imagesContainer}>
              {currentTest.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.depthTextContainer,
                    { 
                      borderColor: selectedOptionIndex === index ? theme.primary : 'transparent',
                      borderWidth: selectedOptionIndex === index ? 3 : 0,
                      backgroundColor: theme.formInputBackground
                    }
                  ]}
                  onPress={() => handleOptionSelect(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.depthText, 
                    { 
                      color: theme.text,
                      textShadowColor: 'rgba(0, 0, 0, ' + (option.isCloser ? '0.5' : '0.1') + ')',
                      textShadowOffset: { width: option.isCloser ? 2 : 0, height: option.isCloser ? 4 : 1 },
                      textShadowRadius: option.isCloser ? 6 : 2,
                      transform: [
                        { scale: option.isCloser ? 1.05 : 1 },
                        { translateY: option.isCloser ? -3 : 0 }
                      ],
                      opacity: option.isCloser ? 1 : 0.9,
                      elevation: option.isCloser ? 10 : 2,
                      shadowColor: "#000",
                      shadowOffset: { 
                        width: option.isCloser ? 1 : 0, 
                        height: option.isCloser ? 6 : 2 
                      },
                      shadowOpacity: option.isCloser ? 0.4 : 0.1,
                      shadowRadius: option.isCloser ? 8 : 3
                    }
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.skipButton, { borderColor: theme.text }]}
                onPress={handleSkip}
              >
                <Text style={[styles.skipButtonText, { color: theme.text }]}>
                  {t('process.visualTest.skip')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.nextButton, { 
                  backgroundColor: selectedOptionIndex !== null ? theme.primary : theme.formInputBackground,
                  opacity: selectedOptionIndex !== null ? 1 : 0.7
                }]}
                onPress={handleNext}
                disabled={selectedOptionIndex === null}
              >
                <Text style={[styles.nextButtonText, { color: '#FFFFFF' }]}>
                  {currentTestIndex < depthTests.length - 1 
                    ? t('process.visualTest.next') 
                    : t('process.visualTest.finish')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={[styles.scoreCircle, {
              backgroundColor: score >= depthTests.length / 2 ? '#34C759' : '#FF3B30'
            }]}>
              <Text style={styles.scoreText}>{score}/{depthTests.length}</Text>
            </View>
            
            <Text style={[styles.resultTitle, { color: theme.text }]}>
              {score >= depthTests.length / 2 
                ? t('process.visualTest.depthPerception.passTitle') 
                : t('process.visualTest.depthPerception.failTitle')}
            </Text>
            
            <Text style={[styles.resultDescription, { color: theme.text }]}>
              {score >= depthTests.length / 2 
                ? t('process.visualTest.depthPerception.passDescription') 
                : t('process.visualTest.depthPerception.failDescription')}
            </Text>
            
            <TouchableOpacity 
              style={[styles.nextTestButton, { backgroundColor: theme.primary }]}
              onPress={handleNextTest}
            >
              <Text style={styles.nextTestButtonText}>
                {t('process.visualTest.nextTest')}
              </Text>
            </TouchableOpacity>
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
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 18,
    marginBottom: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
    paddingVertical: 20,
  },
  depthTextContainer: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 12,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  depthText: {
    fontSize: 70,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  nextTestButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  nextTestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 