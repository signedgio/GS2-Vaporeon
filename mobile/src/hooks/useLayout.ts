import { useWindowDimensions } from 'react-native';

/** Diz se a tela e larga (computador/navegador) para usar layout em colunas. */
export function useLayout() {
  const { width } = useWindowDimensions();
  return { largo: width >= 900, width };
}