import { Stack } from 'expo-router';
import { Confirm } from '@/pages/confirm';

export default function ConfirmRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Confirmar Cuenta' }} />
      <Confirm />
    </>
  );
}
