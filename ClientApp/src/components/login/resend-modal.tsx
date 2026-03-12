import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Button } from '@/components/ui/button';
import { colors } from '@/constants/colors';

type ResendModalProps = {
  visible: boolean;
  message: string;
  resending: boolean;
  onResend: () => void;
  onClose: () => void;
};

export function ResendModal({ visible, message, resending, onResend, onClose }: ResendModalProps) {
  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={styles.modal} onPress={() => {}}>
        <Text style={styles.modalTitle}>Cuenta no activada</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <Button
          style={styles.modalButton}
          label="Reenviar email"
          onPress={onResend}
          disabled={resending}
        />
        <Button
          variant="secondary"
          style={styles.modalClose}
          label="Cerrar"
          onPress={onClose}
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 16,
    width: '100%',
  },
  modalClose: {
    marginTop: 16,
    width: '100%',
  },
});
