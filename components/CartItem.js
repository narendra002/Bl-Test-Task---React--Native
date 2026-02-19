import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const theme = useTheme();
  const discountedPrice = item.price - (item.price * item.discountPercentage) / 100;
  const imageUri = item.thumbnail;

  return (
    <View testID={`cart-item-${item.id}`} style={[styles.container, theme.shadows.sm, { backgroundColor: theme.colors.surface }]}>
      <Image source={{ uri: imageUri }} style={[styles.image, { backgroundColor: theme.colors.borderLight }]} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.brand, { color: theme.colors.textSecondary }]}>{item.brand}</Text>
        <Text style={[styles.price, { color: theme.colors.primary }]}>
          ${(discountedPrice * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.actions}>
          <View style={[styles.quantityRow, { backgroundColor: theme.colors.borderLight }]}>
            <TouchableOpacity testID={`decrease-${item.id}`} onPress={onDecrease} style={styles.qtyBtn}>
              <Minus size={16} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: theme.colors.text }]}>{item.quantity}</Text>
            <TouchableOpacity testID={`increase-${item.id}`} onPress={onIncrease} style={styles.qtyBtn}>
              <Plus size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity testID={`remove-${item.id}`} onPress={onRemove} style={styles.removeBtn}>
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  brand: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
  },
});

export default React.memo(CartItem);
