import { StyleSheet, View, Text, TextInput, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams, useNavigationContainerRef } from 'expo-router';
import { useLoading } from '@/context/loading-context';
import { authService } from '@/services/auth-service';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

type FieldErrors = {
  password?: string;
  confirmPassword?: string;
};

function validate(password: string, confirmPassword: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
}

type PageState = 'form' | 'loading' | 'success' | 'error';

export function ResetPassword() {
  const router = useRouter();
  const rootNav = useNavigationContainerRef();
  const { withLoading } = useLoading();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [pageState, setPageState] = useState<PageState>('form');
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
    }
  }, [token]);

  if (!token) {
    return <View style={styles.page} />;
  }

  const handleSubmit = async () => {
    const validationErrors = validate(password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBtnDisabled(true);
    const result = await withLoading(() => authService.resetPassword(token, password));
    setBtnDisabled(false);

    if (result.success) {
      setPageState('success');
      setMessage(result.message || 'Tu contraseña ha sido restablecida exitosamente.');
    } else {
      setPageState('error');
      setMessage(result.message || 'No se pudo restablecer la contraseña.');
    }
  };

  if (pageState === 'success' || pageState === 'error') {
    const isSuccess = pageState === 'success';
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <Image source={require('@/../assets/images/Logo2.png')} style={styles.logo} />
          <Ionicons
            name={isSuccess ? 'checkmark-circle' : 'close-circle'}
            size={80}
            color={isSuccess ? '#38A169' : '#E53E3E'}
          />
          <Text style={[styles.title, isSuccess ? styles.successText : styles.errorTextColor]}>
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

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Image source={require('@/../assets/images/Logo2.png')} style={styles.logo} />
        <Text style={styles.title}>Restablecer contraseña</Text>

        <View style={styles.fieldWrapper}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Nueva contraseña"
            value={password}
            onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
            secureTextEntry
            autoComplete="new-password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.fieldWrapper}>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setErrors((e) => ({ ...e, confirmPassword: undefined })); }}
            secureTextEntry
            autoComplete="new-password"
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <Button
          style={styles.button}
          label="Restablecer contraseña"
          onPress={handleSubmit}
          disabled={btnDisabled}
        />
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: colors.primary,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#E53E3E',
    borderWidth: 1.5,
  },
  errorText: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    color: '#E53E3E',
    fontSize: 12,
  },
  successText: {
    color: '#38A169',
  },
  errorTextColor: {
    color: '#E53E3E',
  },
  button: {
    width: '100%',
  },
});
