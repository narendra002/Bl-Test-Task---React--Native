import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '@/store';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerBackTitle: 'Back' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            title: 'Product Details',
            headerTintColor: '#0D7C66',
            headerTitleStyle: { fontWeight: '600', color: '#1A1A2E' },
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#F5F5F7' },
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Checkout',
            headerTintColor: '#0D7C66',
            headerTitleStyle: { fontWeight: '600', color: '#1A1A2E' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="order-success" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </Provider>
  );
}
