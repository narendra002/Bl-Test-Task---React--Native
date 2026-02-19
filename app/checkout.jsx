import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { Banknote, MapPin, Package } from 'lucide-react-native';
import Button from '@/components/Button';
import { selectCartItems, selectCartTotal, clearCart } from '@/features/cart/cartSlice';
import { useTheme } from '@/theme';

export default function CheckoutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { user } = useSelector((state) => state.auth);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = useCallback(() => {
    dispatch(clearCart());
    router.replace('/order-success');
  }, [dispatch, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, theme.shadows.sm, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <MapPin size={20} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Delivery Address</Text>
          </View>
          <Text style={[styles.cardValue, { color: theme.colors.textSecondary }]}>
            {user?.name || 'Customer'}
          </Text>
          <Text style={[styles.cardSubvalue, { color: theme.colors.textLight }]}>
            123 Main Street, City, Country
          </Text>
        </View>

        <View style={[styles.card, theme.shadows.sm, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <Banknote size={20} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Payment Method</Text>
          </View>
          <View style={[styles.codBadge, { backgroundColor: theme.colors.accentLight }]}>
            <Text style={[styles.codText, { color: theme.colors.accent }]}>Cash on Delivery</Text>
          </View>
        </View>

        <View style={[styles.card, theme.shadows.sm, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <Package size={20} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Order Summary</Text>
          </View>
          {items.map((item) => {
            const dp = item.price - (item.price * item.discountPercentage) / 100;
            return (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={[styles.summaryName, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.title} × {item.quantity}
                </Text>
                <Text style={[styles.summaryPrice, { color: theme.colors.text }]}>
                  ${(dp * item.quantity).toFixed(2)}
                </Text>
              </View>
            );
          })}

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Subtotal ({itemCount} items)
            </Text>
            <Text style={[styles.summaryPrice, { color: theme.colors.text }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Delivery
            </Text>
            <Text style={[styles.freeText, { color: theme.colors.success }]}>FREE</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, theme.shadows.lg, { backgroundColor: theme.colors.surface }]}>
        <Button
          testID="place-order-btn"
          title="Place Order"
          onPress={handlePlaceOrder}
          disabled={items.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSubvalue: {
    fontSize: 13,
    lineHeight: 20,
  },
  codBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  codText: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  freeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
