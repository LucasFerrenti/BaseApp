import { Stack } from 'expo-router';
import { ResetPassword } from '@/pages/reset-password';

export default function ResetPasswordRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Restablecer Contraseña' }} />
      <ResetPassword />
    </>
  );
}
