import { StyleSheet, TouchableOpacity, type TouchableOpacityProps, Text } from 'react-native';

export type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: 'primary' | 'secondary';
};

export function Button({ label, variant = 'primary', style, ...rest }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        style,
      ]}
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#8B5E3C',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B5E3C',
  },
  label: {
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#8B5E3C',
  },
});
