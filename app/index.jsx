import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { getStoredUser } from '@/features/auth/authService';
import { setUser, clearUser } from '@/features/auth/authSlice';
import { useTheme } from '@/theme';

export default function IndexScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getStoredUser();
        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(clearUser());
        }
      } catch (e) {
        console.log('Auth check error:', e);
        dispatch(clearUser());
      }
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
