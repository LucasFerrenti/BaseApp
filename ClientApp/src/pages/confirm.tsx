import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams, useNavigationContainerRef } from 'expo-router';
import { authService } from '@/services/auth-service';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

type ConfirmState = 'loading' | 'success' | 'error';

export function Confirm() {
  const router = useRouter();
  const rootNav = useNavigationContainerRef();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [state, setState] = useState<ConfirmState>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      const redirect = () => router.replace('/login');
      if (rootNav?.isReady()) {
        redirect();
      } else {
        const unsubscribe = rootNav?.addListener('state', () => {
          redirect();
          unsubscribe?.();
        });
      }
      return;
    }

    authService.confirmAccount(token).then((result) => {
      if (result.success) {
        setState('success');
        setMessage(result.message || 'Tu cuenta ha sido confirmada exitosamente.');
      } else {
        setState('error');
        setMessage(result.message || 'No se pudo confirmar la cuenta.');
      }
    });
  }, [token]);

  if (!token) {
    return (
      <View style={styles.page}>
      </View>
    );
  }

  if (state === 'loading') {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <ActivityIndicator size={64} color={colors.primary} />
          <Text style={styles.title}>Confirmando cuenta...</Text>
          <Text style={styles.subtitle}>Por favor espera un momento</Text>
        </View>
      </View>
    );
  }

  const isSuccess = state === 'success';

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Image source={require('@/../assets/images/Logo2.png')} style={styles.logo} />
        <Ionicons
          name={isSuccess ? 'checkmark-circle' : 'close-circle'}
          size={80}
          color={isSuccess ? '#38A169' : '#E53E3E'}
        />
        <Text style={[styles.title, isSuccess ? styles.successText : styles.errorText]}>
          {message}
        </Text>
        {isSuccess && (
          <Button
            style={styles.button}
            label="Iniciar sesión"
            onPress={() => router.replace('/login')}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 400,
    width: '90%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginTop: 10,
  },
  successText: {
    color: '#38A169',
  },
  errorText: {
    color: '#E53E3E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 15,
  },
});
