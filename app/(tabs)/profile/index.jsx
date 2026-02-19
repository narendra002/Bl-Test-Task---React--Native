import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User, Mail, Calendar } from 'lucide-react-native';
import Button from '@/components/Button';
import { useTheme } from '@/theme';
import { clearUser } from '@/features/auth/authSlice';
import { removeUser } from '@/features/auth/authService';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await removeUser();
          dispatch(clearUser());
          router.replace('/login');
        },
      },
    ]);
  }, [dispatch, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.avatarSection]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={[styles.nameText, { color: theme.colors.text }]}>
          {user?.name || 'User'}
        </Text>
      </View>

      <View style={[styles.infoCard, theme.shadows.sm, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Mail size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {user?.email || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <User size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Full Name</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {user?.name || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <Button
          testID="logout-btn"
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          style={{ borderColor: theme.colors.error }}
          textStyle={{ color: theme.colors.error }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginLeft: 54,
  },
  logoutSection: {
    marginTop: 32,
  },
});
