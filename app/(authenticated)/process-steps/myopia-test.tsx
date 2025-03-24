import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions for responsive layout
const { width, height } = Dimensions.get('window');

// Test data for myopia test
// Each test contains a letter with decreasing font size
const myopiaTests = [
  { id: 1, letter: 'E', fontSize: 90 },
  { id: 2, letter: 'F', fontSize: 70 },
  { id: 3, letter: 'P', fontSize: 55 },
  { id: 4, letter: 'T', fontSize: 40 },
  { id: 5, letter: 'O', fontSize: 30 },
  { id: 6, letter: 'Z', fontSize: 22 },
  { id: 7, letter: 'D', fontSize: 16 },
  { id: 8, letter: 'L', fontSize: 12 }
];

// Number of correct answers needed to pass
const PASSING_THRESHOLD = 6;

export default function MyopiaTest() {
  const { id } = useLocalSearchParams();
  const { completedProcesses, updateProcessVerificationStep, saveTestResults } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(myopiaTests.length).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const currentTest = myopiaTests[currentTestIndex];
  
  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleAnswerChange = (text: string) => {
    // Convert to uppercase for easier comparison
    setCurrentAnswer(text.toUpperCase());
  };
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  const handleSubmit = async () => {
    if (currentAnswer.trim() === '') {
      Alert.alert(
        t('process.visualTest.myopia.emptyAnswer'),
        t('process.visualTest.myopia.enterLetter'),
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Save current answer
    const newAnswers = [...userAnswers];
    newAnswers[currentTestIndex] = currentAnswer.trim();
    setUserAnswers(newAnswers);
    
    // Check if answer is correct
    const isCorrect = currentAnswer.trim().toUpperCase() === currentTest.letter;
    
    if (currentTestIndex < myopiaTests.length - 1) {
      // Move to next test
      setCurrentTestIndex(currentTestIndex + 1);
      setCurrentAnswer('');
    } else {
      // Calculate score
      const totalCorrect = newAnswers.filter(
        (answer, index) => answer.toUpperCase() === myopiaTests[index].letter
      ).length;
      
      setCorrectAnswers(totalCorrect);
      setTestCompleted(true);
      
      // Save progress and results to context
      if (id) {
        console.log('Before update in handleSubmit - Process:', completedProcesses.find(p => p.id === id));
        
        // Mark visual test as completed - sets visualTestCompleted to true in the process
        const updatedProcess = await updateProcessVerificationStep(id.toString(), 'visualTest', true);
        
        console.log('After update in handleSubmit - Process:', updatedProcess);
        
        if (!updatedProcess?.visualTestCompleted) {
          console.warn('Failed to update visualTestCompleted flag in handleSubmit');
        }
        
        // Save test results
        const testResults = {
          score: totalCorrect,
          totalQuestions: myopiaTests.length,
          passed: totalCorrect >= PASSING_THRESHOLD
        };
        
        await saveTestResults(id.toString(), 'myopia', testResults);
      }
    }
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
          onPress: async () => {
            const newAnswers = [...userAnswers];
            newAnswers[currentTestIndex] = ''; // Empty string indicates skipped
            setUserAnswers(newAnswers);
            
            if (currentTestIndex < myopiaTests.length - 1) {
              setCurrentTestIndex(currentTestIndex + 1);
              setCurrentAnswer('');
            } else {
              // Calculate score
              const totalCorrect = newAnswers.filter(
                (answer, index) => answer.toUpperCase() === myopiaTests[index].letter
              ).length;
              
              setCorrectAnswers(totalCorrect);
              setTestCompleted(true);
              
              // Save progress and results to context
              if (id) {
                console.log('Before update in handleSkip - Process:', completedProcesses.find(p => p.id === id));
                
                // Mark visual test as completed - sets visualTestCompleted to true in the process
                const updatedProcess = await updateProcessVerificationStep(id.toString(), 'visualTest', true);
                
                console.log('After update in handleSkip - Process:', updatedProcess);
                
                if (!updatedProcess?.visualTestCompleted) {
                  console.warn('Failed to update visualTestCompleted flag in handleSkip');
                }
                
                // Save test results
                const testResults = {
                  score: totalCorrect,
                  totalQuestions: myopiaTests.length,
                  passed: totalCorrect >= PASSING_THRESHOLD
                };
                
                await saveTestResults(id.toString(), 'myopia', testResults);
              }
            }
          },
        },
      ]
    );
  };
  
  const handleFinish = async () => {
    // Mark visual test as completed
    if (id) {
      console.log('Before update - Process:', completedProcesses.find(p => p.id === id));
      
      // Update the process verification step - this marks visualTestCompleted as true
      const updatedProcess = await updateProcessVerificationStep(id.toString(), 'visualTest', true);
      
      // Check if the update was successful
      console.log('After update - Process:', updatedProcess);
      
      if (!updatedProcess?.visualTestCompleted) {
        console.warn('Failed to update visualTestCompleted flag');
      }
      
      // Save test results
      const testResults = {
        score: correctAnswers,
        totalQuestions: myopiaTests.length,
        passed: correctAnswers >= PASSING_THRESHOLD
      };
      
      await saveTestResults(id.toString(), 'myopia', testResults);
      
      // Give time for state to update before navigating
      setTimeout(() => {
        // Navigate back to the visual test screen
        router.push({
          pathname: '/(authenticated)/process-steps/visual-test',
          params: { id }
        });
      }, 500);
    } else {
      router.push('/(authenticated)/home');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>
              {testCompleted 
                ? t('process.visualTest.myopia.results') 
                : t('process.visualTest.myopia.title')}
            </Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.formInputBackground }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${testCompleted ? 100 : (currentTestIndex / myopiaTests.length) * 100}%`,
                    backgroundColor: theme.primary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {testCompleted 
                ? t('process.visualTest.completed') 
                : `${currentTestIndex + 1}/${myopiaTests.length}`}
            </Text>
          </View>
          
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {!testCompleted ? (
              <>
                <Text style={[styles.description, { color: theme.text }]}>
                  {t('process.visualTest.myopia.instructions')}
                </Text>
                
                <View style={[styles.letterContainer, { backgroundColor: theme.formInputBackground }]}>
                  <Text 
                    style={[
                      styles.letterText, 
                      { 
                        color: theme.text,
                        fontSize: currentTest.fontSize
                      }
                    ]}
                  >
                    {currentTest.letter}
                  </Text>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    {t('process.visualTest.myopia.whatLetterQuestion')}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: theme.formInputBackground,
                        color: theme.text,
                        borderColor: theme.formInputBorder
                      }
                    ]}
                    value={currentAnswer}
                    onChangeText={handleAnswerChange}
                    placeholder={t('process.visualTest.myopia.enterLetterPlaceholder')}
                    placeholderTextColor="gray"
                    autoCapitalize="characters"
                    maxLength={1}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
                </View>
                
                <View style={[styles.buttonRow, Platform.OS === 'ios' && keyboardVisible ? styles.keyboardVisibleButtons : {}]}>
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
                      backgroundColor: currentAnswer.trim() !== '' ? theme.primary : theme.formInputBackground,
                      opacity: currentAnswer.trim() !== '' ? 1 : 0.7
                    }]}
                    onPress={handleSubmit}
                    disabled={currentAnswer.trim() === ''}
                  >
                    <Text style={[styles.nextButtonText, { color: '#FFFFFF' }]}>
                      {currentTestIndex < myopiaTests.length - 1 
                        ? t('process.visualTest.next') 
                        : t('process.visualTest.finish')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.resultsContainer}>
                <View style={[styles.scoreCircle, {
                  backgroundColor: correctAnswers >= PASSING_THRESHOLD ? '#34C759' : '#FF3B30'
                }]}>
                  <Text style={styles.scoreText}>{correctAnswers}/{myopiaTests.length}</Text>
                </View>
                
                <Text style={[styles.resultTitle, { color: theme.text }]}>
                  {correctAnswers >= PASSING_THRESHOLD
                    ? t('process.visualTest.myopia.passTitle') 
                    : t('process.visualTest.myopia.failTitle')}
                </Text>
                
                <Text style={[styles.resultDescription, { color: theme.text }]}>
                  {correctAnswers >= PASSING_THRESHOLD
                    ? t('process.visualTest.myopia.passDescription') 
                    : t('process.visualTest.myopia.failDescription')}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.finishButton, { backgroundColor: theme.primary }]}
                  onPress={handleFinish}
                >
                  <Text style={styles.finishButtonText}>
                    {t('process.visualTest.finish')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    width: '100%',
  },
  letterContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 16,
    maxHeight: 200,
    alignSelf: 'center',
  },
  letterText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 32,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    height: 60,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  keyboardVisibleButtons: {
    marginTop: 16,
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
  finishButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 