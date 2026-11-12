import { View } from 'react-native';
import { useTheme } from '../ThemeContext';

/** Gotinha: mascote original do app. Fica amarela quando a estacao pede atencao. */
export function Gotinha({ tamanho = 56, atencao = false }: { tamanho?: number; atencao?: boolean }) {
  const { colors } = useTheme();
  const corpo = atencao ? colors.warn : colors.water;
  const lado = tamanho * 0.62;
  const olho = tamanho * 0.09;

  return (
    <View style={{ width: tamanho, height: tamanho }}>
      {/* Corpo: quadrado girado 45 graus com uma quina reta vira uma gota */}
      <View
        style={{
          position: 'absolute',
          left: (tamanho - lado) / 2,
          top: tamanho * 0.3,
          width: lado,
          height: lado,
          backgroundColor: corpo,
          borderRadius: lado / 2,
          borderTopLeftRadius: 0,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* Brilho */}
      <View
        style={{
          position: 'absolute',
          left: tamanho * 0.3,
          top: tamanho * 0.5,
          width: tamanho * 0.1,
          height: tamanho * 0.1,
          borderRadius: tamanho * 0.05,
          backgroundColor: 'rgba(255,255,255,0.7)',
        }}
      />
      {/* Olhos */}
      <View style={{ position: 'absolute', left: tamanho * 0.36, top: tamanho * 0.58, width: olho, height: olho, borderRadius: olho / 2, backgroundColor: '#12303f' }} />
      <View style={{ position: 'absolute', left: tamanho * 0.58, top: tamanho * 0.58, width: olho, height: olho, borderRadius: olho / 2, backgroundColor: '#12303f' }} />
      {/* Sorriso */}
      <View
        style={{
          position: 'absolute',
          left: tamanho * 0.42,
          top: tamanho * 0.66,
          width: tamanho * 0.16,
          height: tamanho * 0.08,
          borderBottomLeftRadius: tamanho * 0.08,
          borderBottomRightRadius: tamanho * 0.08,
          borderWidth: 2,
          borderTopWidth: 0,
          borderColor: '#12303f',
        }}
      />
    </View>
  );
}