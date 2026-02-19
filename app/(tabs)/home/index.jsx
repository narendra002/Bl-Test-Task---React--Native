import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react-native';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { addToCart } from '@/features/cart/cartSlice';
import { useTheme } from '@/theme';
import { useState } from 'react';

export default function ProductsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, hasMore, loadMore, totalCount } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = searchQuery.trim()
    ? products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : products;

  const handleProductPress = useCallback(
    (product) => {
      router.push(`/product/${product.id}`);
    },
    [router]
  );

  const handleAddToCart = useCallback(
    (product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const isLeft = index % 2 === 0;
      return (
        <View style={[styles.cardWrapper, isLeft ? styles.cardLeft : styles.cardRight]}>
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            onAddToCart={() => handleAddToCart(item)}
          />
        </View>
      );
    },
    [handleProductPress, handleAddToCart]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore || searchQuery.trim()) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading more...</Text>
      </View>
    );
  }, [hasMore, theme, searchQuery]);

  const keyExtractor = useCallback((item) => String(item.id), []);

  const handleEndReached = useCallback(() => {
    if (hasMore && !searchQuery.trim()) {
      loadMore();
    }
  }, [hasMore, loadMore, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerArea}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight }]}>
          <Search size={18} color={theme.colors.textLight} />
          <TextInput
            testID="search-input"
            placeholder="Search products..."
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.colors.text }]}
            autoCorrect={false}
          />
        </View>
      </View>
      <FlatList
        testID="products-list"
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No products found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48.5%',
  },
  cardLeft: {
    marginRight: '1.5%',
  },
  cardRight: {
    marginLeft: '1.5%',
  },
  headerArea: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  resultText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  loaderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
