import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme';

export default function CartLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { fontWeight: '700', color: theme.colors.text, fontSize: 18 },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My Cart' }} />
    </Stack>
  );
}
