import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { t } from '../../constants/i18n';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { verifyCode } = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errors, setErrors] = useState<string>('');
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setErrors(t('auth.invalidCode'));
      return;
    }

    try {
      await verifyCode(verificationCode);
      router.replace('/(authenticated)/home');
    } catch (error) {
      setErrors(t('auth.verificationFailed'));
    }
  };

  const handleResendCode = () => {
    // TODO: Implement resend code functionality
    setTimeLeft(60);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.primaryTitles }]}>
          {t('auth.verifyCode')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          {t('auth.verifyCodeSubtitle')}
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                { 
                  backgroundColor: theme.background,
                  borderColor: errors ? theme.danger : theme.formInputBorder,
                  color: theme.text
                }
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {errors ? (
          <Text style={[styles.errorText, { color: theme.danger }]}>{errors}</Text>
        ) : null}

        <TouchableOpacity 
          style={[
            styles.verifyButton, 
            { backgroundColor: theme.primary }
          ]} 
          onPress={handleVerify}
        >
          <Text style={styles.verifyButtonText}>{t('auth.verify')}</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: theme.text }]}>
            {t('auth.didntReceiveCode')}
          </Text>
          {timeLeft > 0 ? (
            <Text style={[styles.timerText, { color: theme.text }]}>
              {timeLeft}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={[styles.resendButton, { color: theme.primary }]}>
                {t('auth.resendCode')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  verifyButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    marginBottom: 5,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resendButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 