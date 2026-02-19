import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Star, Minus, Plus, ShoppingCart, Package, Truck, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Button from '@/components/Button';
import { useProductById } from '@/hooks/useProducts';
import { addToCart } from '@/features/cart/cartSlice';
import { useTheme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.85;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const product = useProductById(id);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addScale = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const validImages = useMemo(() => {
    if (!product) return [];
    const imgs = (product.images || []).filter((img) => img !== null && img !== undefined);
    if (imgs.length === 0 && product.thumbnail) return [product.thumbnail];
    return imgs;
  }, [product]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.price - (product.price * product.discountPercentage) / 100;
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    Animated.sequence([
      Animated.spring(addScale, { toValue: 1.08, useNativeDriver: true, speed: 50 }),
      Animated.spring(addScale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start(() => {
      router.replace('/(tabs)/cart');
    });
  }, [product, quantity, dispatch, addScale, router]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveImageIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderCarouselImage = useCallback(({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image
          source={{ uri: item }}
          style={styles.carouselImage}
          resizeMode="contain"
        />
      </View>
    );
  }, []);

  const carouselKeyExtractor = useCallback((item, index) => `carousel-${index}`, []);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.notFoundText, { color: theme.colors.textSecondary }]}>
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.imageSection, { backgroundColor: theme.colors.surface }]}>
          <FlatList
            ref={flatListRef}
            data={validImages}
            renderItem={renderCarouselImage}
            keyExtractor={carouselKeyExtractor}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="center"
          />
          {validImages.length > 1 && (
            <View style={styles.paginationRow}>
              {validImages.map((_, index) => {
                const inputRange = [
                  (index - 1) * SCREEN_WIDTH,
                  index * SCREEN_WIDTH,
                  (index + 1) * SCREEN_WIDTH,
                ];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 24, 8],
                  extrapolate: 'clamp',
                });
                const dotOpacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        width: dotWidth,
                        opacity: dotOpacity,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                );
              })}
            </View>
          )}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1}/{validImages.length}
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.categoryRow}>
            <Text style={[styles.category, { color: theme.colors.primary, backgroundColor: theme.colors.primaryLight }]}>
              {product.category}
            </Text>
            <Text style={[styles.brand, { color: theme.colors.textSecondary }]}>{product.brand}</Text>
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>{product.title}</Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color={theme.colors.rating}
                fill={star <= Math.round(product.rating) ? theme.colors.rating : 'transparent'}
              />
            ))}
            <Text style={[styles.ratingValue, { color: theme.colors.textSecondary }]}>
              {product.rating} / 5
            </Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={[styles.currentPrice, { color: theme.colors.text }]}>
              ${discountedPrice.toFixed(2)}
            </Text>
            {product.discountPercentage > 0 && (
              <View style={styles.priceExtra}>
                <Text style={[styles.originalPrice, { color: theme.colors.textLight }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <View style={[styles.saveBadge, { backgroundColor: theme.colors.successLight }]}>
                  <Text style={[styles.saveText, { color: theme.colors.success }]}>
                    Save {Math.round(product.discountPercentage)}%
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {product.description}
          </Text>

          <View style={styles.infoCards}>
            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
              <Package size={18} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
              <Truck size={18} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>Free Delivery</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, theme.shadows.lg, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.quantitySelector, { backgroundColor: theme.colors.borderLight }]}>
          <TouchableOpacity
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={styles.qtyBtn}
          >
            <Minus size={18} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.qtyValue, { color: theme.colors.text }]}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            style={styles.qtyBtn}
          >
            <Plus size={18} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.addBtnWrapper, { transform: [{ scale: addScale }] }]}>
          <Button
            testID="add-to-cart-detail"
            title={`Add to Cart · $${(discountedPrice * quantity).toFixed(2)}`}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  notFoundText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
  },
  imageSection: {
    width: '100%',
    position: 'relative',
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailSection: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  brand: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800',
  },
  priceExtra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoCards: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'center',
  },
  addBtnWrapper: {
    flex: 1,
  },
});
