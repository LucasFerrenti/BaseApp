import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';
type ToastPosition = 'top' | 'bottom';
type ToastAlign = 'start' | 'center' | 'end';

type ToastConfig = {
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  align?: ToastAlign;
  duration?: number;
};

type ToastState = Required<Omit<ToastConfig, 'duration'>> & {
  id: number;
  duration: number;
};

type ToastContextType = {
  showToast: (config: ToastConfig) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: '#F0FFF4', border: '#38A169', text: '#276749', icon: '\u2713' },
  error:   { bg: '#FFF5F5', border: '#E53E3E', text: '#9B2C2C', icon: '\u2717' },
  info:    { bg: '#EBF8FF', border: '#3182CE', text: '#2A4365', icon: '\u2139' },
};

const ALIGN_MAP: Record<ToastAlign, 'flex-start' | 'center' | 'flex-end'> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};

const SLIDE_DISTANCE = 80;
const ENTER_DURATION = 300;
const EXIT_DURATION = 200;

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colors = COLORS[toast.type];

  const progress = useSharedValue(0);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    progress.value = withTiming(1, { duration: ENTER_DURATION });

    const timer = setTimeout(() => {
      progress.value = withTiming(0, { duration: EXIT_DURATION }, (finished) => {
        if (finished) runOnJS(dismissRef.current)();
      });
    }, toast.duration);

    return () => clearTimeout(timer);
  }, []);

  const direction = toast.position === 'top' ? -1 : 1;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * SLIDE_DISTANCE * direction }],
  }));

  const positionStyle = toast.position === 'top'
    ? { top: insets.top + 12 }
    : { bottom: insets.bottom + 12 };

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        positionStyle,
        { alignItems: ALIGN_MAP[toast.align], width },
        animatedStyle,
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.toast, { backgroundColor: colors.bg, borderLeftColor: colors.border }]}>
        <Text style={[styles.icon, { color: colors.border }]}>{colors.icon}</Text>
        <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((config: ToastConfig) => {
    const id = ++idRef.current;
    const toast: ToastState = {
      id,
      message: config.message,
      type: config.type ?? 'info',
      position: config.position ?? 'top',
      align: config.align ?? 'center',
      duration: config.duration ?? 3000,
    };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 0,
    zIndex: 99999,
    paddingHorizontal: 16,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    maxWidth: 420,
    minWidth: 200,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
});
