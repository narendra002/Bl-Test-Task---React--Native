import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck } from 'lucide-react-native';
import Button from '@/components/Button';
import { useTheme } from '@/theme';

export default function OrderSuccessScreen() {
  const theme = useTheme();
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 6,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.colors.primary }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.flex}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.iconWrapper,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.iconCircle}>
              <CircleCheck size={64} color={theme.colors.primary} />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.textSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.title}>Order Placed!</Text>
            <Text style={styles.subtitle}>
              Your order has been placed successfully.{'\n'}Thank you for shopping with us!
            </Text>

            <View style={[styles.orderInfo, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderId}>#{Date.now().toString().slice(-8)}</Text>
            </View>

            <Text style={styles.codNote}>Payment: Cash on Delivery</Text>
          </Animated.View>

          <Animated.View style={[styles.btnSection, { opacity: fadeAnim }]}>
            <Button
              testID="continue-shopping"
              title="Continue Shopping"
              onPress={() => router.replace('/(tabs)/home')}
              style={{ backgroundColor: theme.colors.white }}
              textStyle={{ color: theme.colors.primary }}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
  },
  orderLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  orderId: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  codNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 14,
    fontWeight: '500',
  },
  btnSection: {
    width: '100%',
  },
});
