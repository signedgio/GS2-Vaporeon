import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { darkColors, lightColors, Palette, shadowFor } from './theme';

interface ThemeValue {
  colors: Palette;
  shadow: { boxShadow: string };
  escuro: boolean;
  alternar: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/** Guarda o modo claro/escuro. O padrao e o escuro (azul-marinho) e o usuario pode trocar pelo botao. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [escuro, setEscuro] = useState(true);

  const value = useMemo<ThemeValue>(
    () => ({
      colors: escuro ? darkColors : lightColors,
      shadow: shadowFor(escuro),
      escuro,
      alternar: () => setEscuro((e) => !e),
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