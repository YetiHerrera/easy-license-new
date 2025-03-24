import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { t } from '../../constants/i18n';
import FormInput from '../../components/auth/FormInput';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { updateUserProfile } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.invalidEmail');
    }
    
    if (!password) {
      newErrors.password = t('auth.passwordRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        // Store the email in the DataContext
        await updateUserProfile({
          email
        });
        
        // First perform the sign in action
        await signIn('dummy-token');
        
        // Then navigate to home after successful sign in
        router.replace('/(authenticated)/home');
      } catch (error) {
        console.error('Error signing in:', error);
        // If sign in fails, we should handle the error appropriately
        // For now, we'll just log it
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement social login
  };

  const goToSignup = () => {
    router.replace('/auth/signup');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.primaryTitles }]}>{t('auth.login')}</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t('auth.signInSubtitle')}
          </Text>
          
          <FormInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.email')}
            keyboardType="email-address"
            error={errors.email}
          />
          
          <FormInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.password')}
            isPassword
            error={errors.password}
          />
          
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={[styles.forgotPasswordText, { color: theme.text, fontWeight: 'bold' }]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.primary }]} 
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>{t('auth.signIn')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToSignup}>
            <Text style={[styles.signupText, { color: theme.text, textDecorationLine: 'underline' }]}>{t('auth.noAccount')}</Text>
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
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