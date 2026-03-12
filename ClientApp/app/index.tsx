import { StyleSheet, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

export default function IndexRoute() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenido, {user?.name ?? ''}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F0E1' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 24, color: '#3D2B1F', fontWeight: '600' },
});
