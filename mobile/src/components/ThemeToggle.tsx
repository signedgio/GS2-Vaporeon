import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

/** Botao do cabecalho que alterna entre modo claro e escuro. */
export function ThemeToggle() {
  const { escuro, alternar } = useTheme();
  return (
    <TouchableOpacity
      onPress={alternar}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={escuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      <Ionicons name={escuro ? 'sunny' : 'moon'} size={22} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});