import { View, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { CheckCircle } from '@/components/icons/CheckCircle';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserInformation() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const requirements = [
    {
      id: 'identity',
      title: t('userInformation.documentTypes.identity'),
      isOptional: false,
    },
    {
      id: 'currentLicense',
      title: t('userInformation.documentTypes.currentLicense'),
      isOptional: true,
    },
    {
      id: 'addressProof',
      title: t('userInformation.documentTypes.addressProof'),
      isOptional: false,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('userInformation.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
          {t('userInformation.requirements.title')}
        </Text>
        
        <Text variant="body" style={[styles.subtitle, { color: theme.text }]}>
          {t('userInformation.subtitle')}
        </Text>

        <View style={styles.requirementsList}>
          {requirements.map((requirement) => (
            <View 
              key={requirement.id} 
              style={[
                styles.requirementItem, 
                { backgroundColor: theme.formInputBackground }
              ]}
            >
              <View style={styles.checkContainer}>
                <CheckCircle color={theme.success} size={24} />
              </View>
              <View style={styles.requirementContent}>
                <Text variant="body" style={[styles.requirementTitle, { color: theme.text }]}>
                  {requirement.title}
                  {requirement.isOptional && (
                    <Text variant="body" style={[styles.optional, { color: theme.icon }]}>
                      {' '}
                      {t('userInformation.optional')}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        backgroundColor: theme.background,
        borderTopColor: theme.formInputBorder 
      }]}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/(authenticated)/document-upload' as any)}
        >
          <Text variant="button" style={styles.buttonText}>
            {t('userInformation.startProcess')}
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
    marginTop: 42,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 42,
  },
  requirementsList: {
    gap: 24,

  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 65,
    padding: 16,
    gap: 12,
  },
  checkContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementContent: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 16,
  },
  optional: {
    fontSize: 16,
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