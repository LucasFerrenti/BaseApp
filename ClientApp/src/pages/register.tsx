import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useToast } from '@/context/toast-context';
import { authApi } from '@/api/auth-api';
import { Link } from 'expo-router';
import { colors } from '@/constants/colors';
import { PROVINCES } from '@/constants/provinces';
import { REGEX } from '@/constants/regex';

type FormData = {
  name: string;
  surname: string;
  email: string;
  state: number | null;
  city: string;
  password: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) errors.name = 'El nombre es requerido';
  if (!form.surname.trim()) errors.surname = 'El apellido es requerido';

  if (!form.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!REGEX.EMAIL.test(form.email.trim())) {
    errors.email = 'Ingresa un email válido';
  }

  if (form.state === null) errors.state = 'La provincia es requerida';
  if (!form.city.trim()) errors.city = 'La ciudad es requerida';

  if (!form.password) {
    errors.password = 'La contraseña es requerida';
  } else if (form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
}

export function Register() {
  const { withLoading } = useLoading();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    state: null,
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [successModal, setSuccessModal] = useState<string | null>(null);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const selectedProvince = PROVINCES.find((p) => p.value === form.state);

  const handleRegister = async () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBtnDisabled(true);
    const result = await withLoading(() =>
      authApi.register({
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        state: form.state!,
        city: form.city.trim(),
        password: form.password,
      })
    );
    setBtnDisabled(false);

    if (result.success) {
      setForm({
        name: '',
        surname: '',
        email: '',
        state: null,
        city: '',
        password: '',
        confirmPassword: '',
      });
      setSuccessModal(result.message);
    } else {
      showToast({ message: result.message, type: 'error' });
    }
  };

  return (
    <View style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            {/* Nombre */}
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Nombre"
                value={form.name}
                onChangeText={(v) => updateField('name', v)}
                autoCapitalize="words"
                autoComplete="given-name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Apellido */}
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, errors.surname && styles.inputError]}
                placeholder="Apellido"
                value={form.surname}
                onChangeText={(v) => updateField('surname', v)}
                autoCapitalize="words"
                autoComplete="family-name"
              />
              {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}
            </View>

            {/* Email */}
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Provincia */}
            <View style={styles.fieldWrapper}>
              <TouchableOpacity
                style={[styles.input, styles.pickerButton, errors.state && styles.inputError]}
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={selectedProvince ? styles.pickerText : styles.pickerPlaceholder}>
                  {selectedProvince?.label ?? 'Selecciona una provincia'}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </TouchableOpacity>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>

            {/* Ciudad */}
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                placeholder="Ciudad"
                value={form.city}
                onChangeText={(v) => updateField('city', v)}
                autoCapitalize="words"
                autoComplete="address-line2"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* Contraseña */}
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Contraseña"
                value={form.password}
                onChangeText={(v) => updateField('password', v)}
                secureTextEntry
                autoComplete="new-password"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.fieldWrapper}>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                secureTextEntry
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <Button
              style={styles.button}
              label="Registrarse"
              onPress={handleRegister}
              disabled={btnDisabled}
            />

            <Link href="/login">
              <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Province Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerModalTitle}>Selecciona una provincia</Text>
            <FlatList
              data={PROVINCES}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    form.state === item.value && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    updateField('state', item.value);
                    setPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      form.state === item.value && styles.pickerItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successModal !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>¡Registro exitoso!</Text>
            <Text style={styles.successMessage}>{successModal}</Text>
            <Link href="/login" onPress={() => setSuccessModal(null)}>
              <Text style={styles.successButton}>iniciar sesión</Text>
            </Link>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.light,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 460,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 18,
  },
  fieldWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 42,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderColor: colors.primary,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: colors.dark,
  },
  inputError: {
    borderColor: '#E53E3E',
    borderWidth: 1.5,
  },
  errorText: {
    position: 'absolute',
    bottom: -16,
    left: 0,
    color: '#E53E3E',
    fontSize: 12,
  },
  button: {
    marginTop: 6,
    marginBottom: 14,
    width: '100%',
  },
  link: {
    color: 'blue',
    marginBottom: 4,
  },

  // Province picker
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 14,
    color: '#000',
  },
  pickerPlaceholder: {
    fontSize: 14,
    color: colors.dark,
  },
  pickerArrow: {
    fontSize: 10,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 460,
    maxHeight: '60%',
    paddingVertical: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  pickerItemSelected: {
    backgroundColor: colors.light,
  },
  pickerItemText: {
    fontSize: 15,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Success modal
  successModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 380,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  successIcon: {
    fontSize: 48,
    color: '#38A169',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 22,
  },
  successButton: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
