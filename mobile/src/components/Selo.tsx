import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { corDoTom, Tom } from '../theme';
import { IconeNome } from '../utils/estado';
import { Text } from './AppText';

interface Props {
  tom: Tom;
  texto: string;
  icone?: IconeNome;
  pequeno?: boolean;
}

/** Etiqueta de estado: cor + icone + texto, para nao depender so da cor. */
export function Selo({ tom, texto, icone, pequeno = false }: Props) {
  const { colors } = useTheme();
  const cor = corDoTom(colors, tom);
  return (
    <View style={[styles.selo, pequeno && styles.pequeno, { backgroundColor: `${cor}22`, borderColor: `${cor}66` }]}>
      {icone ? <Ionicons name={icone} size={pequeno ? 12 : 15} color={cor} /> : null}
      <Text style={{ color: cor, fontSize: pequeno ? 11 : 13, fontWeight: '700' }}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pequeno: { paddingVertical: 2, paddingHorizontal: 8 },
});