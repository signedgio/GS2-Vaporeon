export interface Palette {
  background: string; // fundo da tela
  card: string; // superficie dos cartoes
  cardAlt: string; // superficie secundaria (trilhas, campos, botoes)
  primary: string; // ciano: acoes principais e destaques
  onPrimary: string; // cor do texto sobre o primary
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

/** Tom semantico de um estado. Sempre aparece junto de icone e texto, nunca so como cor. */
export type Tom = 'ok' | 'info' | 'warn' | 'danger' | 'neutro';

export const darkColors: Palette = {
  background: '#081b33',
  card: '#0f2744',
  cardAlt: '#16355a',
  primary: '#22d3ee',
  onPrimary: '#032531',
  primaryDark: '#0b3b5c',
  header: '#0a2240',
  text: '#eaf2fb',
  muted: '#9fb6cf',
  border: '#24466f',
  ok: '#34d399',
  warn: '#fbbf24',
  danger: '#f87171',
  critical: '#fb7185',
  water: '#38bdf8',
  waterSurface: '#7dd3fc',
  tankBorder: '#5b86b3',
};

export const lightColors: Palette = {
  background: '#eef4fa',
  card: '#ffffff',
  cardAlt: '#e8f0f8',
  primary: '#0e7490',
  onPrimary: '#ffffff',
  primaryDark: '#0b3b5c',
  header: '#0a2240',
  text: '#0b2038',
  muted: '#4a647d',
  border: '#ccdaea',
  ok: '#047857',
  warn: '#b45309',
  danger: '#b91c1c',
  critical: '#9f1239',
  water: '#0ea5e9',
  waterSurface: '#7dd3fc',
  tankBorder: '#7a9bbd',
};

export const radius = 14;

export function corDoTom(c: Palette, tom: Tom): string {
  switch (tom) {
    case 'ok':
      return c.ok;
    case 'info':
      return c.primary;
    case 'warn':
      return c.warn;
    case 'danger':
      return c.danger;
    default:
      return c.muted;
  }
}

/** Sombra suave dos cartoes. */
export function shadowFor(escuro: boolean): { boxShadow: string } {
  return { boxShadow: escuro ? '0 2px 8px rgba(0, 0, 0, 0.35)' : '0 2px 8px rgba(11, 32, 56, 0.08)' };
}