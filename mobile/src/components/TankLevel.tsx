import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

/** Barra que representa o nivel do reservatorio (0-100%). */
export function TankLevel({ percent, status }: { percent: number; status: 'ok' | 'warn' | 'danger' }) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Nivel do reservatorio</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${safe}%`, backgroundColor: colors[status] }]} />
      </View>
      <Text style={[styles.percent, { color: colors[status] }]}>{safe.toFixed(1)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius, padding: 16, marginBottom: 12 },
  label: { fontSize: 14, color: colors.muted, fontWeight: '600', marginBottom: 10 },
  track: { height: 26, backgroundColor: colors.border, borderRadius: 13, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 13 },
  percent: { marginTop: 8, fontSize: 28, fontWeight: '800' },
});