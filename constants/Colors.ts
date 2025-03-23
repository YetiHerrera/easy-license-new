/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const primary = '#573CFA';
const secondary = '#FB8D1A';
const danger = '#E8083E';
const success = '#02864A';
const neutral = '#1C1A27';

export const Colors = {
  light: {
    text: neutral,
    background: '#fff',
    tint: tintColorLight,
    icon: neutral,
    tabIconDefault: neutral,
    tabIconSelected: tintColorLight,
    primary,
    secondary,
    danger,
    success,
    neutral,
  },
  dark: {
    text: '#ECEDEE',
    background: neutral,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary,
    secondary,
    danger,
    success,
    neutral,
  },
};
