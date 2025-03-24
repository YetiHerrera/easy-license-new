import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect href="/(onboarding)/step-one" />;
  }

  return <Redirect href="/(authenticated)/home" />;
}