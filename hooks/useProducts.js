import { useState, useMemo, useCallback } from 'react';
import rawData from '@/assets/data/products.json';

const allProducts = rawData.products || rawData;
const PAGE_SIZE = 10;

export const useProducts = () => {
  const [page, setPage] = useState(1);

  const products = useMemo(() => {
    return allProducts.slice(0, page * PAGE_SIZE);
  }, [page]);

  const hasMore = useMemo(() => {
    return page * PAGE_SIZE < allProducts.length;
  }, [page]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  const totalCount = allProducts.length;

  return { products, hasMore, loadMore, totalCount };
};

export const useProductById = (id) => {
  return useMemo(() => {
    return allProducts.find((p) => String(p.id) === String(id)) || null;
  }, [id]);
};
