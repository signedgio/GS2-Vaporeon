import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../ThemeContext';

/** Botao do cabecalho que alterna entre modo escuro e claro. */
export function ThemeToggle() {
  const { colors, escuro, alternar } = useTheme();
  const [foco, setFoco] = useState(false);
  return (
    <Pressable
      onPress={alternar}
      onFocus={() => setFoco(true)}
      onBlur={() => setFoco(false)}
      accessibilityRole="button"
      accessibilityLabel={escuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.cardAlt,
          alignItems: 'center',
          justifyContent: 'center',
        },
        foco && { outlineWidth: 2, outlineColor: colors.primary, outlineStyle: 'solid', outlineOffset: 2 },
      ]}
    >
      <Ionicons name={escuro ? 'sunny' : 'moon'} size={20} color={colors.text} />
    </Pressable>
  );
}