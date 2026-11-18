import { useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { IconeNome } from '../utils/estado';
import { Text } from './AppText';

type Variante = 'primario' | 'secundario' | 'fantasma';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icone?: IconeNome;
  desabilitado?: boolean;
  carregando?: boolean;
  acessibilidadeLabel?: string;
}

/** Botao com area de toque de 44 px e contorno visivel ao navegar pelo teclado. */
export function Botao({ titulo, onPress, variante = 'secundario', icone, desabilitado, carregando, acessibilidadeLabel }: Props) {
  const { colors } = useTheme();
  const [foco, setFoco] = useState(false);
  const inativo = !!desabilitado || !!carregando;
  const fundo = variante === 'primario' ? colors.primary : variante === 'secundario' ? colors.cardAlt : 'transparent';
  const corTexto = variante === 'primario' ? colors.onPrimary : colors.text;
  const borda = variante === 'primario' ? colors.primary : colors.border;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={acessibilidadeLabel ?? titulo}
      accessibilityState={{ disabled: inativo, busy: !!carregando }}
      disabled={inativo}
      onPress={onPress}
      onFocus={() => setFoco(true)}
      onBlur={() => setFoco(false)}
      style={({ pressed }) => [
        {
          minHeight: 44,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: borda,
          backgroundColor: fundo,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: inativo ? 0.55 : pressed ? 0.8 : 1,
        },
        foco && { outlineWidth: 2, outlineColor: colors.primary, outlineStyle: 'solid', outlineOffset: 2 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator size="small" color={corTexto} />
      ) : icone ? (
        <Ionicons name={icone} size={18} color={corTexto} />
      ) : null}
      <Text style={{ color: corTexto, fontSize: 14, fontWeight: '600' }}>{titulo}</Text>
    </Pressable>
  );
}

interface ChipProps {
  rotulo: string;
  ativo: boolean;
  onPress: () => void;
}

/** Opcao de um seletor (periodo, indicador, filtro). Marca a ativa com cor, fundo e peso. */
export function Chip({ rotulo, ativo, onPress }: ChipProps) {
  const { colors } = useTheme();
  const [foco, setFoco] = useState(false);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={rotulo}
      accessibilityState={{ selected: ativo }}
      onPress={onPress}
      onFocus={() => setFoco(true)}
      onBlur={() => setFoco(false)}
      style={[
        {
          minHeight: 44,
          paddingHorizontal: 16,
          borderRadius: 22,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: ativo ? colors.primary : colors.border,
          backgroundColor: ativo ? `${colors.primary}26` : 'transparent',
        },
        foco && { outlineWidth: 2, outlineColor: colors.primary, outlineStyle: 'solid', outlineOffset: 2 },
      ]}
    >
      <Text style={{ color: ativo ? colors.primary : colors.muted, fontSize: 13, fontWeight: ativo ? '700' : '500' }}>
        {rotulo}
      </Text>
    </Pressable>
  );
}