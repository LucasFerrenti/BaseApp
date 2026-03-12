import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

type LoadingContextType = {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  withLoading: <T>(task: () => Promise<T>) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
  withLoading: (task) => task(),
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const counter = useRef(0);

  const showLoading = useCallback(() => {
    counter.current++;
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T,>(task: () => Promise<T>): Promise<T> => {
      showLoading();
      try {
        return await task();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, withLoading }}>
      {children}
      <Modal visible={isLoading} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#8B5E3C" />
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999999999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});
