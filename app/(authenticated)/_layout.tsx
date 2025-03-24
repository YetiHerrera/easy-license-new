import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="process-steps" />
      <Stack.Screen name="document-upload" />
      <Stack.Screen name="license-upload" />
      <Stack.Screen name="liveness-verification" />
      <Stack.Screen name="process-review" />
      <Stack.Screen name="user-information" />
    </Stack>
  );
} 