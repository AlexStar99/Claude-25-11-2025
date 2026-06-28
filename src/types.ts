export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  layoutId: string;
  backgroundImage?: string;
  fontSize?: number;
  colorTheme?: string;
}

export interface LayoutProps {
  slide: Slide;
  fontSize: number;
  textColor?: string;
  backgroundColor?: string;
  accentColor?: string;
}

export interface Layout {
  id: string;
  name: string;
  renderSlide: (slide: Slide, fontSize: number) => React.ReactNode;
}

export interface SlidePosition {
  x: number;
  y: number;
  rotation: number;
}

export interface DoodleElement {
  type: 'circle' | 'line' | 'square' | 'triangle' | 'curve';
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}
