import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLoading } from '@/context/loading-context';
import { authService } from '@/services/auth-service';
import { colors } from '@/constants/colors';
import { REGEX } from '@/constants/regex';

type ForgotPasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
  const { withLoading } = useLoading();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!visible) return null;

  const handleClose = () => {
    setEmail('');
    setError('');
    setMessage('');
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('El email es requerido');
      return;
    }
    if (!REGEX.EMAIL.test(trimmed)) {
      setError('Ingresa un email válido');
      return;
    }

    setSending(true);
    const result = await withLoading(() => authService.forgotPassword(trimmed));
    setSending(false);
    setMessage(result.message);
  };

  return (
    <Pressable style={styles.overlay} onPress={handleClose}>
      <Pressable style={styles.modal} onPress={() => {}}>
        <Text style={styles.title}>Recuperar contraseña</Text>

        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          <>
            <Text style={styles.description}>
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </Text>
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, error ? styles.inputError : undefined]}
                placeholder="Email"
                value={email}
                onChangeText={(v) => { setEmail(v); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
            <Button
              style={styles.submitButton}
              label="Enviar"
              onPress={handleSubmit}
              disabled={sending}
            />
          </>
        )}

        <Button
          variant="secondary"
          style={styles.closeButton}
          label="Cerrar"
          onPress={handleClose}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '50%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  fieldWrapper: {
    width: '100%',
    marginBottom: 4,
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
  submitButton: {
    marginTop: 16,
    width: '100%',
  },
  closeButton: {
    marginTop: 16,
    width: '100%',
  },
});
