import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

/** Aviso exibido quando a API nao responde. O app continua funcionando e tenta reconectar. */
export function OfflineBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Ionicons name="cloud-offline" size={20} color="#fff" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>API fora do ar</Text>
        <Text style={styles.sub}>Mostrando os ultimos dados. Tentando reconectar...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.danger,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sub: { color: '#ffe3e3', fontSize: 12 },
});