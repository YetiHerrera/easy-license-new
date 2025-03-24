import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'button' | 'caption';
}

export function Text({ variant = 'body', style, ...props }: TextProps) {
  return (
    <RNText
      style={[styles[variant], style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
}); 