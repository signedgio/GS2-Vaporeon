import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, Palette, shadowFor } from './theme';

interface ThemeValue {
  colors: Palette;
  shadow: { boxShadow: string };
  escuro: boolean;
  alternar: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/** Guarda o modo claro/escuro. Comeca pelo modo do aparelho e o usuario pode trocar pelo botao. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const sistema = useColorScheme();
  const [escolha, setEscolha] = useState<'claro' | 'escuro' | null>(null);
  const escuro = (escolha ?? (sistema === 'dark' ? 'escuro' : 'claro')) === 'escuro';

  const value = useMemo<ThemeValue>(
    () => ({
      colors: escuro ? darkColors : lightColors,
      shadow: shadowFor(escuro),
      escuro,
      alternar: () => setEscolha(escuro ? 'claro' : 'escuro'),
    }),
    [escuro],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de ThemeProvider');
  return ctx;
}