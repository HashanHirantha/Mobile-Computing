import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { HealthProvider } from '../contexts/HealthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <HealthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="symptoms" />
          <Stack.Screen name="doctors" />
          <Stack.Screen name="appointments" />
        </Stack>
      </HealthProvider>
    </AuthProvider>
  );
}
