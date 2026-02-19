import React, { useRef, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme';

const Button = ({ title, onPress, variant = 'primary', disabled = false, loading = false, style, textStyle, testID }) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  }, [scale]);

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isText = variant === 'text';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.base,
          isPrimary && { backgroundColor: theme.colors.primary },
          isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.colors.primary },
          isText && { backgroundColor: 'transparent', paddingHorizontal: 0 },
          disabled && { opacity: 0.5 },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimary ? theme.colors.white : theme.colors.primary} size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              isPrimary && { color: theme.colors.white },
              isOutline && { color: theme.colors.primary },
              isText && { color: theme.colors.primary },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default React.memo(Button);
