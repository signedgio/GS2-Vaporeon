import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LIMITES } from '../config';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { Text } from './AppText';

const TEXTO: Record<'ok' | 'warn' | 'danger', string> = {
  ok: 'Nível normal',
  warn: 'Quase transbordando',
  danger: 'Nível crítico',
};

interface Props {
  percent: number;
  status: 'ok' | 'warn' | 'danger';
  grande?: boolean;
}

/** Reservatorio desenhado como um tanque de agua azul, com o nivel subindo e descendo de forma animada. */
export function TankLevel({ percent, status, grande = false }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow, grande), [colors, shadow, grande]);
  const safe = Math.max(0, Math.min(100, percent));
  const anim = useRef(new Animated.Value(safe)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: safe,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [safe, anim]);

  const altura = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  // A agua e sempre azul. O numero e a etiqueta usam a cor do estado (azul quando normal).
  const corEstado = status === 'ok' ? colors.water : colors[status];

  return (
    <View style={styles.card}>
      <View style={styles.tank}>
        <Animated.View style={[styles.water, { height: altura }]}>
          <View style={styles.surface} />
        </Animated.View>
        <View style={[styles.mark, { bottom: `${LIMITES.nivelMinimo}%` }]} />
        <View style={[styles.mark, { bottom: `${LIMITES.nivelMaximo}%` }]} />
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Nível do reservatório</Text>
        <Text style={[styles.percent, { color: corEstado }]}>{safe.toFixed(1)}%</Text>
        <View style={[styles.badge, { backgroundColor: `${corEstado}22` }]}>
          <Text style={[styles.badgeText, { color: corEstado }]}>{TEXTO[status]}</Text>
        </View>
        <Text style={styles.limits}>
          Mínimo {LIMITES.nivelMinimo}% · Máximo {LIMITES.nivelMaximo}%
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (c: Palette, shadow: { boxShadow: string }, grande: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 22,
      backgroundColor: c.card,
      borderRadius: radius,
      padding: 20,
      marginBottom: 14,
      ...shadow,
    },
    tank: {
      width: grande ? 120 : 84,
      height: grande ? 240 : 170,
      borderRadius: 18,
      borderWidth: 3,
      borderColor: c.tankBorder,
      backgroundColor: c.border,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    water: { width: '100%', backgroundColor: c.water },
    surface: { height: 6, backgroundColor: c.waterSurface, opacity: 0.8 },
    mark: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: 'rgba(255,255,255,0.55)' },
    info: { flex: 1 },
    label: { fontSize: 14, color: c.muted, fontWeight: '600' },
    percent: { fontSize: grande ? 60 : 44, fontWeight: '800', marginVertical: 2 },
    badge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
    badgeText: { fontSize: 13, fontWeight: '700' },
    limits: { marginTop: 10, fontSize: 12, color: c.muted },
  });