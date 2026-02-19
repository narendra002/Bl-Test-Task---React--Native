import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/theme';

const Input = ({ label, value, onChangeText, placeholder, error, secureTextEntry, keyboardType, autoCapitalize, testID }) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setFocused(true);
    Animated.timing(borderColor, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  }, [borderColor]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    Animated.timing(borderColor, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  }, [borderColor]);

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? theme.colors.error : theme.colors.border, error ? theme.colors.error : theme.colors.primary],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.colors.surface, borderColor: animatedBorderColor },
        ]}
      >
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: theme.colors.text }]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.textLight} />
            ) : (
              <Eye size={20} color={theme.colors.textLight} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default React.memo(Input);
