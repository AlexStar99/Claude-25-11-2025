export interface ColorTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'white', name: 'Белый', backgroundColor: '#FFFFFF', textColor: '#111111', accentColor: '#111111' },
  { id: 'black', name: 'Чёрный', backgroundColor: '#111111', textColor: '#F5F5F5', accentColor: '#F5F5F5' },
  { id: 'cream', name: 'Кремовый', backgroundColor: '#FAF6EF', textColor: '#2C1A0E', accentColor: '#7D5A3C' },
  { id: 'navy', name: 'Тёмно-синий', backgroundColor: '#0F1B33', textColor: '#E8EAF6', accentColor: '#7986CB' },
  { id: 'sage', name: 'Шалфей', backgroundColor: '#E8EDE5', textColor: '#2D3B2D', accentColor: '#4A7C59' },
  { id: 'blush', name: 'Розовый', backgroundColor: '#FEE8E8', textColor: '#4A1A1A', accentColor: '#C0392B' },
  { id: 'charcoal', name: 'Угольный', backgroundColor: '#2D2D2D', textColor: '#F0F0F0', accentColor: '#BDBDBD' },
  { id: 'forest', name: 'Лесной', backgroundColor: '#1A2E1A', textColor: '#E8F5E8', accentColor: '#81C784' },
];

export function getTheme(themeId?: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === themeId) ?? COLOR_THEMES[0];
}
