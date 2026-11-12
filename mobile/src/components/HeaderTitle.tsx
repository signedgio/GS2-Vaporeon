import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './AppText';

/** Titulo do cabecalho: marca Vaporeon (fonte Libre Baskerville) + nome da tela atual. */
export function HeaderTitle({ tela }: { tela: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.logo}>
        <Ionicons name="water" size={22} color="#fff" />
      </View>
      <View>
        <Text style={styles.title}>Vaporeon</Text>
        <Text style={styles.sub}>Smart Water & Energy Station · {tela}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 19, fontFamily: 'LibreBaskerville_700Bold' },
  sub: { color: '#bfe6f5', fontSize: 11, fontWeight: '500' },
});