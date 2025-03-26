import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { t } from '../../constants/i18n';
import FormInput from '../../components/auth/FormInput';
import PhoneInput from '../../components/auth/PhoneInput';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function SignupScreen() {
  const router = useRouter();
  const { sendVerificationCode } = useAuth();
  const { updateUserProfile } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+502'); // Default to Guatemala
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.invalidEmail');
    }
    
    if (!phoneNumber) {
      newErrors.phoneNumber = t('auth.phoneRequired');
    }
    
    if (!password) {
      newErrors.password = t('auth.passwordRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validate()) {
      try {
        setIsLoading(true);
        
        // Save user profile data to DataContext
        await updateUserProfile({
          email,
          phoneNumber,
          countryCode
        });
        
        // Send verification code
        await sendVerificationCode(email, `${countryCode}${phoneNumber}`);
        router.push('/auth/verify-code');
      } catch (error) {
        console.error('Error during signup:', error);
        setErrors({ submit: t('auth.signupFailed') });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement social login
  };

  const goToLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContent,
              keyboardVisible && styles.scrollContentKeyboard
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('@/assets/images/LogoMaycom.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={[styles.title, { color: theme.primaryTitles }]}>{t('auth.createAccount')}</Text>
              <Text style={[styles.subtitle, { color: theme.text }]}>
                {t('auth.createAccountSubtitle')}
              </Text>
              
              <FormInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.email')}
                keyboardType="email-address"
                error={errors.email}
              />
              
              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                countryCode={countryCode}
                onChangeCountryCode={setCountryCode}
                error={errors.phoneNumber}
              />
              
              <FormInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.password')}
                isPassword
                error={errors.password}
              />
              
              {errors.submit && (
                <Text style={[styles.errorText, { color: theme.danger }]}>{errors.submit}</Text>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.signupButton, 
                  { backgroundColor: theme.primary },
                  isLoading && styles.disabledButton
                ]} 
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? t('auth.sending') : t('auth.createAccount')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={goToLogin}>
                <Text style={[styles.loginText, { color: theme.text, textDecorationLine: 'underline' }]}>
                  {t('auth.haveAccount')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  scrollContentKeyboard: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
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
  signupButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 180,
    height: 100,
  },
}); 