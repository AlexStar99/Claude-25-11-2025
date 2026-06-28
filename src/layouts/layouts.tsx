import type { LayoutProps } from '../types';
import { Doodles, generateRandomDoodles } from '../components/Doodles';
import { getRandomOffset, getRandomRotation } from '../utils/textProcessing';

export function CenteredLayout({ slide, fontSize, textColor = '#111111', accentColor = '#111111' }: LayoutProps) {
  const titleOffset = { x: getRandomOffset(-20, 20), y: getRandomOffset(-20, 20) };
  const subtitleOffset = { x: getRandomOffset(-15, 15), y: getRandomOffset(-15, 15) };
  const bodyOffset = { x: getRandomOffset(-10, 10), y: getRandomOffset(-10, 10) };
  const doodles = generateRandomDoodles(4, accentColor);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center p-16 text-center"
      style={{ color: textColor }}
    >
      <Doodles elements={doodles} />

      <div className="relative z-10" style={{ transform: `translate(${titleOffset.x}px, ${titleOffset.y}px) rotate(${getRandomRotation()}deg)` }}>
        <h1 className="font-bold mb-6" style={{ fontSize: `${fontSize * 1.8}px`, lineHeight: '1.2' }}>
          {slide.title}
        </h1>
      </div>

      {slide.subtitle && (
        <div className="relative z-10" style={{ transform: `translate(${subtitleOffset.x}px, ${subtitleOffset.y}px) rotate(${getRandomRotation()}deg)` }}>
          <h2 className="font-semibold mb-8 opacity-70" style={{ fontSize: `${fontSize * 1.2}px`, lineHeight: '1.3' }}>
            {slide.subtitle}
          </h2>
        </div>
      )}

      {slide.body && (
        <div className="relative z-10 max-w-3xl" style={{ transform: `translate(${bodyOffset.x}px, ${bodyOffset.y}px)` }}>
          <p className="whitespace-pre-wrap" style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
            {slide.body}
          </p>
        </div>
      )}
    </div>
  );
}

export function LeftAlignedLayout({ slide, fontSize, textColor = '#111111', accentColor = '#111111' }: LayoutProps) {
  const titleRotation = getRandomRotation();
  const doodles = generateRandomDoodles(5, accentColor);

  return (
    <div className="relative w-full h-full flex flex-col justify-center p-20" style={{ color: textColor }}>
      <Doodles elements={doodles} />

      <div className="relative z-10 max-w-4xl">
        <div style={{ transform: `rotate(${titleRotation}deg)`, transformOrigin: 'left center' }}>
          <h1 className="font-bold mb-6" style={{ fontSize: `${fontSize * 2}px`, lineHeight: '1.1' }}>
            {slide.title}
          </h1>
        </div>

        {slide.subtitle && (
          <div className="pl-4 border-l-4 mb-8" style={{ borderColor: accentColor }}>
            <h2 className="font-medium" style={{ fontSize: `${fontSize * 1.3}px`, lineHeight: '1.3' }}>
              {slide.subtitle}
            </h2>
          </div>
        )}

        {slide.body && (
          <div className="mt-10">
            <p className="whitespace-pre-wrap" style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}>
              {slide.body}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SplitLayout({ slide, fontSize, textColor = '#111111', accentColor = '#111111' }: LayoutProps) {
  const doodles = generateRandomDoodles(6, accentColor);

  return (
    <div className="relative w-full h-full" style={{ color: textColor }}>
      <Doodles elements={doodles} />

      {/* Top section */}
      <div
        className="relative z-10 h-2/5 flex items-center justify-center p-16"
        style={{ backgroundColor: `${accentColor}10` }}
      >
        <div className="text-center">
          <h1 className="font-bold" style={{ fontSize: `${fontSize * 2.2}px`, lineHeight: '1.1' }}>
            {slide.title}
          </h1>
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 h-3/5 flex flex-col justify-center p-16">
        {slide.subtitle && (
          <h2 className="font-semibold mb-8 text-center" style={{ fontSize: `${fontSize * 1.4}px`, lineHeight: '1.3' }}>
            {slide.subtitle}
          </h2>
        )}

        {slide.body && (
          <div className="max-w-3xl mx-auto">
            <p className="whitespace-pre-wrap text-center" style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}>
              {slide.body}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CornerAccentLayout({ slide, fontSize, textColor = '#111111', backgroundColor = '#FFFFFF', accentColor = '#111111' }: LayoutProps) {
  const doodles = generateRandomDoodles(3, accentColor);

  return (
    <div className="relative w-full h-full p-20" style={{ color: textColor }}>
      <Doodles elements={doodles} />

      {/* Decorative corner */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-bl-full z-0"
        style={{ backgroundColor: accentColor, opacity: 0.08 }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="inline-block px-8 py-4 mb-8" style={{ backgroundColor: accentColor, color: backgroundColor }}>
            <h1 className="font-bold" style={{ fontSize: `${fontSize * 1.8}px`, lineHeight: '1.2' }}>
              {slide.title}
            </h1>
          </div>

          {slide.subtitle && (
            <h2 className="font-semibold mb-10 max-w-2xl" style={{ fontSize: `${fontSize * 1.3}px`, lineHeight: '1.4' }}>
              {slide.subtitle}
            </h2>
          )}
        </div>

        {slide.body && (
          <div className="max-w-3xl">
            <p className="whitespace-pre-wrap" style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}>
              {slide.body}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const layouts = [
  {
    id: 'centered',
    name: 'По центру',
    component: CenteredLayout,
  },
  {
    id: 'left',
    name: 'Слева',
    component: LeftAlignedLayout,
  },
  {
    id: 'split',
    name: 'Разделённый',
    component: SplitLayout,
  },
  {
    id: 'corner',
    name: 'Угловой акцент',
    component: CornerAccentLayout,
  },
];
