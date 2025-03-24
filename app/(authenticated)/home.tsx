import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';

export default function Home() {
  const [hasActiveProcess, setHasActiveProcess] = useState(false);
  const { signOut } = useAuth();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const handleStartNewProcess = () => {
    router.replace('/(authenticated)/user-information');
  };

  if (hasActiveProcess) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: theme.text }]}>{t('home.withProcess')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/image_licence_blank.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.text }]}>
          {t('home.emptyState.title')}
        </Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {t('home.emptyState.description')}
        </Text>
        <TouchableOpacity 
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={handleStartNewProcess}
        >
          <Text style={styles.buttonText}>{t('home.emptyState.startButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  exploreButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
  },
}); 