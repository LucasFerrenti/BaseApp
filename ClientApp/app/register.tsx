import { Stack } from 'expo-router';
import { Register } from '@/pages/register';

export default function RegisterRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Register' }} />
      <Register />
    </>
  );
}
