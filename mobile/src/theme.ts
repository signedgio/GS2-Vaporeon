export interface Palette {
  background: string;
  card: string;
  primary: string;
  primaryDark: string;
  header: string;
  text: string;
  muted: string;
  border: string;
  ok: string;
  warn: string;
  danger: string;
  critical: string;
  water: string;
  waterSurface: string;
  tankBorder: string;
}

export const lightColors: Palette = {
  background: '#eaf6fb',
  card: '#ffffff',
  primary: '#1b8fc4',
  primaryDark: '#0d5c82',
  header: '#0d5c82',
  text: '#12303f',
  muted: '#6a8795',
  border: '#d4e6ee',
  ok: '#2e9e6b',
  warn: '#e8a317',
  danger: '#d64545',
  critical: '#8e1b3a',
  water: '#1e9be0',
  waterSurface: '#7cc9f2',
  tankBorder: '#0d5c82',
};

export const darkColors: Palette = {
  background: '#0b1c26',
  card: '#13303f',
  primary: '#3fb2e0',
  primaryDark: '#0a3a52',
  header: '#0a2f42',
  text: '#e6f3f9',
  muted: '#8fb0c0',
  border: '#24475a',
  ok: '#3fcf8e',
  warn: '#f2b84b',
  danger: '#ff6b6b',
  critical: '#ff4d79',
  water: '#2aa8e8',
  waterSurface: '#8fd6fa',
  tankBorder: '#5fb8e0',
};

export const radius = 18;

/** Sombra suave dos cartoes (mais forte no modo escuro). */
export function shadowFor(escuro: boolean): { boxShadow: string } {
  return { boxShadow: escuro ? '0 3px 12px rgba(0, 0, 0, 0.40)' : '0 3px 10px rgba(13, 92, 130, 0.10)' };
}