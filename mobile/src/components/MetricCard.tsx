import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { Text } from './AppText';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  status: 'ok' | 'warn' | 'danger';
  hint?: string;
}

export function MetricCard({ icon, label, value, unit, status, hint }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
  const color = colors[status];
  return (
    <View style={styles.card}>
      <View style={[styles.iconBubble, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const makeStyles = (c: Palette, shadow: { boxShadow: string }) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: c.card,
      borderRadius: radius,
      padding: 18,
      marginBottom: 14,
      ...shadow,
    },
    iconBubble: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 14, color: c.muted, fontWeight: '600' },
    valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
    value: { fontSize: 34, fontWeight: '800' },
    unit: { fontSize: 15, color: c.muted },
    hint: { marginTop: 2, fontSize: 12, color: c.muted },
  });