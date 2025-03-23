import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { t } from '../../constants/i18n';

const StepTwo = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/step-2.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.text }]}>
        {t('onboarding.steps.two.title')}
      </Text>
      <Text style={[styles.description, { color: colors.text }]}>
        {t('onboarding.steps.two.description')}
      </Text>
    </View>
  );
};

export default StepTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '80%',
    height: 230,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 