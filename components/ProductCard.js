import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Star, ShoppingCart } from 'lucide-react-native';
import { useTheme } from '@/theme';

const ProductCard = ({ product, onPress, onAddToCart }) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  }, [scale]);

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;
  const imageUri = (product.images && product.images.find((img) => img !== null)) || product.thumbnail;

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <TouchableOpacity
        testID={`product-card-${product.id}`}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.card, theme.shadows.md, { backgroundColor: theme.colors.surface }]}
      >
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.borderLight }]}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          {product.discountPercentage > 5 && (
            <View style={[styles.discountBadge, { backgroundColor: theme.colors.discount }]}>
              <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}%</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.brand, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {product.brand}
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
            {product.title}
          </Text>
          <View style={styles.ratingRow}>
            <Star size={13} color={theme.colors.rating} fill={theme.colors.rating} />
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              {product.rating}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <View style={styles.priceGroup}>
              <Text style={[styles.price, { color: theme.colors.text }]}>
                ${discountedPrice.toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <Text style={[styles.originalPrice, { color: theme.colors.textLight }]}>
                  ${product.price.toFixed(2)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              testID={`add-to-cart-${product.id}`}
              onPress={onAddToCart}
              style={[styles.cartBtn, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.7}
            >
              <ShoppingCart size={16} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    padding: 12,
  },
  brand: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ProductCard);
