import { StyleSheet, Text as RNText, TextProps } from 'react-native';

// Poppins e a fonte padrao do app. Com fonte personalizada, cada peso e uma "familia" diferente.
const FAMILIAS: Record<string, string> = {
  '400': 'Poppins_400Regular',
  '500': 'Poppins_500Medium',
  '600': 'Poppins_600SemiBold',
  '700': 'Poppins_700Bold',
  '800': 'Poppins_800ExtraBold',
  '900': 'Poppins_800ExtraBold',
};

/** Use este Text no lugar do Text do react-native: ele aplica a Poppins conforme o fontWeight. */
export function Text({ style, ...props }: TextProps) {
  const plano = StyleSheet.flatten(style) ?? {};
  const peso = plano.fontWeight === 'bold' ? '700' : String(plano.fontWeight ?? '400');
  const familia = plano.fontFamily ?? FAMILIAS[peso] ?? FAMILIAS['400'];
  return <RNText {...props} style={[style, { fontFamily: familia, fontWeight: 'normal' }]} />;
}