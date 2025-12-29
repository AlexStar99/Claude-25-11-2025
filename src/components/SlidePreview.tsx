import { useEffect, useRef, useState } from 'react';
import { Slide } from '../types';
import { layouts } from '../layouts/layouts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlidePreviewProps {
  slide: Slide;
  onNavigate?: (direction: 'prev' | 'next') => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
  currentIndex?: number;
  totalSlides?: number;
}

export function SlidePreview({
  slide,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
  currentIndex = 0,
  totalSlides = 1,
}: SlidePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(slide.fontSize || 28);
  const [scale, setScale] = useState(1);

  // Автоадаптация размера шрифта
  useEffect(() => {
    const checkOverflow = () => {
      if (!slideRef.current) return;

      const element = slideRef.current;
      const isOverflowing =
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth;

      if (isOverflowing && fontSize > 12) {
        setFontSize((prev) => Math.max(12, prev - 1));
      }
    };

    checkOverflow();
  }, [slide, fontSize]);

  // Масштабирование для помещения на экран
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scaleX = containerWidth / 1080;
      const scaleY = containerHeight / 1350;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canNavigatePrev) {
        onNavigate?.('prev');
      } else if (e.key === 'ArrowRight' && canNavigateNext) {
        onNavigate?.('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canNavigatePrev, canNavigateNext, onNavigate]);

  const layoutComponent = layouts.find((l) => l.id === slide.layoutId)?.component || layouts[0].component;
  const LayoutComponent = layoutComponent;

  return (
    <div className="flex flex-col h-full">
      {/* Навигация и информация */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate?.('prev')}
            disabled={!canNavigatePrev}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-sm font-medium">
            Слайд {currentIndex + 1} из {totalSlides}
          </span>

          <button
            onClick={() => onNavigate?.('next')}
            disabled={!canNavigateNext}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Размер шрифта: {fontSize}px | Масштаб: {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Превью слайда */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-hidden"
      >
        <div
          id={`slide-${slide.id}`}
          ref={slideRef}
          className="bg-white shadow-2xl overflow-hidden relative"
          style={{
            width: '1080px',
            height: '1350px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Фоновое изображение */}
          {slide.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
                zIndex: 0,
              }}
            />
          )}

          {/* Контент слайда */}
          <LayoutComponent slide={slide} fontSize={fontSize} />
        </div>
      </div>
    </div>
  );
}
