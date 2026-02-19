import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react-native';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import {
  selectCartItems,
  selectCartTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '@/features/cart/cartSlice';
import { useTheme } from '@/theme';

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleIncrease = useCallback((id) => dispatch(increaseQuantity(id)), [dispatch]);
  const handleDecrease = useCallback((id) => dispatch(decreaseQuantity(id)), [dispatch]);
  const handleRemove = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);

  const renderItem = useCallback(
    ({ item }) => (
      <CartItem
        item={item}
        onIncrease={() => handleIncrease(item.id)}
        onDecrease={() => handleDecrease(item.id)}
        onRemove={() => handleRemove(item.id)}
      />
    ),
    [handleIncrease, handleDecrease, handleRemove]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primaryLight }]}>
          <ShoppingCart size={40} color={theme.colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Your cart is empty</Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
          Browse products and add items to your cart
        </Text>
        <Button
          title="Start Shopping"
          onPress={() => router.push('/(tabs)/home')}
          style={{ marginTop: 24, paddingHorizontal: 32 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        testID="cart-list"
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.bottomBar, theme.shadows.lg, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: theme.colors.text }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
        <Button
          testID="checkout-btn"
          title="Proceed to Checkout"
          onPress={() => router.push('/checkout')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 180,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '800',
  },
});
