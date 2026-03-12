import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { LoadingProvider } from '@/context/loading-context';
import { ToastProvider } from '@/context/toast-context';
import { ConsumerNavbar } from '@/components/ui/consumer-navbar';

function RootLayoutNav() {
  const { user, isReady } = useAuth();
  const authContext = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isReady) return;
    const loginRoutes = ['login', 'register', 'confirm', 'reset-password'];
    const inLogin = loginRoutes.includes(segments[0]);

    if (!user && !inLogin) {
      router.replace('/login');
    } else if (user && inLogin) {
      router.replace('/');
    }
  }, [user, segments, isMounted, isReady]);

  const showConsumerNavbar = user && user.roleId === 1 && segments[0] !== 'login';
  if (!isMounted) {
    return (
      <View style={styles.root}>
      </View>
    );
  }
  return (
    <View style={styles.root}>
      {showConsumerNavbar && (
        <ConsumerNavbar
          onLeftPress={() => router.push('/')}
          onRightPress={authContext.signOut}
        />
      )}
      <View style={styles.content}>
        <Slot />
      </View>
      <StatusBar style={showConsumerNavbar ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
