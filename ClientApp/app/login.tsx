import { Stack } from 'expo-router';
import { Login } from '@/pages/login';

export default function LoginRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <Login />
    </>
  );
}
