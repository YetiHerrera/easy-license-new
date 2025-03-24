import { View, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function LivenessVerification() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('livenessVerification.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
          {t('livenessVerification.title')}
        </Text>
        
        <Text variant="body" style={[styles.subtitle, { color: theme.text }]}>
          {t('livenessVerification.subtitle')}
        </Text>
        
        <View style={styles.infoContainer}>
          <View style={[styles.infoItem, { backgroundColor: theme.formInputBackground }]}>
            <FontAwesome name="info-circle" size={24} color={theme.success} style={styles.infoIcon} />
            <Text variant="body" style={[styles.infoText, { color: theme.text }]}>
              {t('livenessVerification.instruction1')}
            </Text>
          </View>
          
          <View style={[styles.infoItem, { backgroundColor: theme.formInputBackground }]}>
            <FontAwesome name="info-circle" size={24} color={theme.success} style={styles.infoIcon} />
            <Text variant="body" style={[styles.infoText, { color: theme.text }]}>
              {t('livenessVerification.instruction2')}
            </Text>
          </View>
          
          <View style={[styles.infoItem, { backgroundColor: theme.formInputBackground }]}>
            <FontAwesome name="info-circle" size={24} color={theme.success} style={styles.infoIcon} />
            <Text variant="body" style={[styles.infoText, { color: theme.text }]}>
              {t('livenessVerification.instruction3')}
            </Text>
          </View>

          <View style={[styles.infoItem, { backgroundColor: theme.formInputBackground }]}>
            <FontAwesome name="info-circle" size={24} color={theme.success} style={styles.infoIcon} />
            <Text variant="body" style={[styles.infoText, { color: theme.text }]}>
              {t('livenessVerification.instruction4')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        backgroundColor: theme.background,
        borderTopColor: theme.formInputBorder 
      }]}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/(authenticated)/liveness-verification/liveness-process' as any)}
        >
          <Text variant="button" style={styles.buttonText}>
            {t('livenessVerification.startVerification')}
          </Text>
        </Pressable>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  infoContainer: {
    gap: 16,
    marginTop: 16,
  },
  infoItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 