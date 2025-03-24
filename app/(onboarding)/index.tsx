import { Stack } from 'expo-router';

export default function OnboardingRoot() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="step-one" />
      <Stack.Screen name="step-two" />
      <Stack.Screen name="step-three" />
    </Stack>
  );
} 