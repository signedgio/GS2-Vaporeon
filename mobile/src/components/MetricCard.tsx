import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  status: 'ok' | 'warn' | 'danger';
  hint?: string;
}

export function MetricCard({ icon, label, value, unit, status, hint }: Props) {
  const color = colors[status];
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.row}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderLeftWidth: 6,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 14, color: colors.muted, fontWeight: '600' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 6 },
  value: { fontSize: 34, fontWeight: '800' },
  unit: { fontSize: 15, color: colors.muted },
  hint: { marginTop: 4, fontSize: 12, color: colors.muted },
});