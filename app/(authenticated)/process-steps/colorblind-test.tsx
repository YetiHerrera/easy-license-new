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
  TextInput,
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

// Colorblind test data with images and correct answers
const colorblindTests = [
  { id: 1, image: require('@/assets/images/visual-test/7.png'), correctAnswer: '7' },
  { id: 2, image: require('@/assets/images/visual-test/9.png'), correctAnswer: '9' },
  { id: 3, image: require('@/assets/images/visual-test/12.png'), correctAnswer: '12' },
  { id: 4, image: require('@/assets/images/visual-test/74.png'), correctAnswer: '74' },
];

// Interface for the visual test progress
interface VisualTestProgress {
  completed: boolean;
  score: number;
  total: number;
}

export default function ColorblindTest() {
  const { id } = useLocalSearchParams();
  const { completedProcesses, updateProcessVerificationStep } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(colorblindTests.length).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentTest = colorblindTests[currentTestIndex];
  
  const handleGoBack = () => {
    if (currentTestIndex > 0) {
      setCurrentTestIndex(currentTestIndex - 1);
      setCurrentAnswer(userAnswers[currentTestIndex - 1]);
    } else {
      router.back();
    }
  };
  
  const handleNext = () => {
    // Save current answer
    const newAnswers = [...userAnswers];
    newAnswers[currentTestIndex] = currentAnswer;
    setUserAnswers(newAnswers);
    
    if (currentTestIndex < colorblindTests.length - 1) {
      // Move to next test
      setCurrentTestIndex(currentTestIndex + 1);
      setCurrentAnswer(userAnswers[currentTestIndex + 1]);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter(
        (answer, index) => answer === colorblindTests[index].correctAnswer
      ).length;
      
      setScore(correctAnswers);
      setTestCompleted(true);
      
      // Save progress to context - in a real implementation, we would update this
      // For now, using updateProcessVerificationStep as a placeholder
      if (id) {
        // Using 'visualTest' as the verification step since that's what's defined in the context
        updateProcessVerificationStep(id.toString(), 'visualTest', true);
      }
    }
  };
  
  const handleNextTest = () => {
    // Navigate to the next test (depth perception)
    // This will be implemented later when we create the depth perception test
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
            newAnswers[currentTestIndex] = '';
            setUserAnswers(newAnswers);
            
            if (currentTestIndex < colorblindTests.length - 1) {
              setCurrentTestIndex(currentTestIndex + 1);
              setCurrentAnswer(userAnswers[currentTestIndex + 1]);
            } else {
              // Calculate score with skipped answers
              const correctAnswers = newAnswers.filter(
                (answer, index) => answer === colorblindTests[index].correctAnswer
              ).length;
              
              setScore(correctAnswers);
              setTestCompleted(true);
              
              // Save progress to context
              if (id) {
                // Using 'visualTest' as the verification step since that's what's defined in the context
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
            ? t('process.visualTest.colorblind.results') 
            : t('process.visualTest.colorblind.title')}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.formInputBackground }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${testCompleted ? 100 : (currentTestIndex / colorblindTests.length) * 100}%`,
                backgroundColor: theme.primary 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.text }]}>
          {testCompleted 
            ? t('process.visualTest.completed') 
            : `${currentTestIndex + 1}/${colorblindTests.length}`}
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
              {t('process.visualTest.colorblind.instructions')}
            </Text>
            
            <View style={[styles.imageContainer, { backgroundColor: theme.formInputBackground }]}>
              <Image
                source={currentTest.image}
                style={styles.testImage}
                resizeMode="contain"
              />
            </View>
            
            <Text style={[styles.questionText, { color: theme.text }]}>
              {t('process.visualTest.colorblind.question')}
            </Text>
            
            <View style={[styles.inputContainer, { backgroundColor: theme.formInputBackground }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
                placeholder={t('process.visualTest.colorblind.inputPlaceholder')}
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={3}
              />
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
                  backgroundColor: currentAnswer.trim() ? theme.primary : theme.formInputBackground,
                  opacity: currentAnswer.trim() ? 1 : 0.7
                }]}
                onPress={handleNext}
                disabled={!currentAnswer.trim()}
              >
                <Text style={[styles.nextButtonText, { color: '#FFFFFF' }]}>
                  {currentTestIndex < colorblindTests.length - 1 
                    ? t('process.visualTest.next') 
                    : t('process.visualTest.finish')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={[styles.scoreCircle, {
              backgroundColor: score >= colorblindTests.length / 2 ? '#34C759' : '#FF3B30'
            }]}>
              <Text style={styles.scoreText}>{score}/{colorblindTests.length}</Text>
            </View>
            
            <Text style={[styles.resultTitle, { color: theme.text }]}>
              {score >= colorblindTests.length / 2 
                ? t('process.visualTest.colorblind.passTitle') 
                : t('process.visualTest.colorblind.failTitle')}
            </Text>
            
            <Text style={[styles.resultDescription, { color: theme.text }]}>
              {score >= colorblindTests.length / 2 
                ? t('process.visualTest.colorblind.passDescription') 
                : t('process.visualTest.colorblind.failDescription')}
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
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 32,
  },
  testImage: {
    width: '90%',
    height: '90%',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  inputContainer: {
    borderRadius: 8,
    marginBottom: 32,
  },
  input: {
    fontSize: 18,
    padding: 16,
    textAlign: 'center',
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
    color: '#FFFFFF',
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