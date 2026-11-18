import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LIMITES } from '../config';
import { useTheme } from '../ThemeContext';
import { Text } from './AppText';

const ALTURA = 200;
const LARGURA = 92;

/**
 * Desenho do reservatorio. A agua ocupa exatamente o percentual medido (0 a 100%)
 * e as linhas de minimo e maximo ficam nas posicoes configuradas.
 */
export function Reservatorio({ percent }: { percent: number }) {
  const { colors } = useTheme();
  const seguro = Math.max(0, Math.min(100, percent));
  const anim = useRef(new Animated.Value(seguro)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: seguro, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [seguro, anim]);

  const altura = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View
      style={styles.linha}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Reservatório com ${seguro.toFixed(0)}% de nível. Mínimo ${LIMITES.nivelMinimo}%, máximo ${LIMITES.nivelMaximo}%.`}
    >
      <View style={[styles.tanque, { backgroundColor: colors.cardAlt }]}>
        <Animated.View style={[styles.agua, { height: altura, backgroundColor: colors.water }]}>
          <View style={[styles.superficie, { backgroundColor: colors.waterSurface }]} />
        </Animated.View>
        <View style={[styles.linhaLimite, { bottom: `${LIMITES.nivelMinimo}%`, backgroundColor: colors.danger }]} />
        <View style={[styles.linhaLimite, { bottom: `${LIMITES.nivelMaximo}%`, backgroundColor: colors.warn }]} />
        <View pointerEvents="none" style={[styles.contorno, { borderColor: colors.tankBorder }]} />
      </View>

      <View style={styles.escala}>
        <Text style={[styles.rotulo, { bottom: `${LIMITES.nivelMaximo}%`, color: colors.warn }]}>máx. {LIMITES.nivelMaximo}%</Text>
        <Text style={[styles.rotulo, { bottom: `${LIMITES.nivelMinimo}%`, color: colors.danger }]}>mín. {LIMITES.nivelMinimo}%</Text>
        <Text style={[styles.rotulo, { bottom: '0%', color: colors.muted, marginBottom: -4 }]}>0%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', height: ALTURA },
  tanque: { width: LARGURA, height: ALTURA, borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-end' },
  agua: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  superficie: { height: 3, opacity: 0.9 },
  linhaLimite: { position: 'absolute', left: 0, right: 0, height: 2, opacity: 0.9 },
  contorno: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 2, borderRadius: 14 },
  escala: { width: 74, height: ALTURA, marginLeft: 8 },
  rotulo: { position: 'absolute', left: 0, fontSize: 11, fontWeight: '600', marginBottom: -8 },
});