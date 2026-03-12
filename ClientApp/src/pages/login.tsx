import { StyleSheet, View, Text, TextInput, Image, Pressable } from 'react-native';
import { Button } from '@/components/ui/button';
import { ResendModal } from '@/components/login/resend-modal';
import { ForgotPasswordModal } from '@/components/login/forgot-password-modal';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/context/loading-context';
import { useToast } from '@/context/toast-context';
import { authService } from '@/services/auth-service';
import { Link } from 'expo-router';
import { colors } from '@/constants/colors';
import { REGEX } from '@/constants/regex';

type FieldErrors = {
  email?: string;
  password?: string;
};

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!REGEX.EMAIL.test(email.trim())) {
    errors.email = 'Ingresa un email válido';
  }
  if (!password) {
    errors.password = 'La contraseña es requerida';
  }
  return errors;
}

export function Login() {
  const authContext = useAuth();
  const { withLoading } = useLoading();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);

  const handleLogin = async () => {
    const validationErrors = validate(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBtnDisabled(true);
    const result = await withLoading(() => authContext.signIn({ email, password }));
    setBtnDisabled(false);
    if (!result.success) {
      if (result.errors?.includes('ACCOUNT_NOT_ACTIVATED')) {
        setModalMessage(result.message);
        setModalVisible(true);
      } else {
        showToast({ message: result.message, type: 'error' });
      }
    }
    else {
      showToast({ message: result.message, type: 'success', position: 'bottom', align: 'end' });
    }
  };

  const handleResend = async () => {
    setResending(true);
    const result = await withLoading(() => authService.resendConfirmation(email));
    setResending(false);
    setModalMessage(result.message);
  };

  return (
    <View style={styles.page}>
      <ForgotPasswordModal
        visible={forgotVisible}
        onClose={() => setForgotVisible(false)}
      />
      <ResendModal
        visible={modalVisible}
        message={modalMessage}
        resending={resending}
        onResend={handleResend}
        onClose={() => setModalVisible(false)}
      />
      <View style={styles.container}>
        <Image source={require('@/../assets/images/Logo2.png')} style={styles.logo} />
        <Text style={styles.title}>Portal Mascotas</Text>
        <View style={styles.fieldWrapper}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={email}
            onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.fieldWrapper}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        <Button style={styles.button} label="Iniciar sesión" onPress={handleLogin} disabled={btnDisabled} />
        <Link href="/register">
          <Text style={styles.text}>¿No tienes una cuenta? Regístrate</Text>
        </Link>
        <Pressable onPress={() => setForgotVisible(true)}>
          <Text style={styles.text}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { 
    flex: 1,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: { 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20, 
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxWidth: 335,
  },
  title: {
    fontSize: 24, 
    marginBottom: 12, 
    color: colors.dark, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    marginBottom: 12,
    color: 'blue'
  },
  fieldWrapper: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 15,
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
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 3,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  button: {
    marginBottom: 15,
  },
});
