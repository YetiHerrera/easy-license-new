import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { t } from '../../constants/i18n';
import FormInput from '../../components/auth/FormInput';
import PhoneInput from '../../components/auth/PhoneInput';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { sendVerificationCode } = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+502'); // Default to Guatemala
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
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
  }
}); 