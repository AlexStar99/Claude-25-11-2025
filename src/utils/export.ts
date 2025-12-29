import { toPng } from 'html-to-image';
import { Slide } from '../types';

export async function exportSlideAsPng(slideId: string, filename: string): Promise<void> {
  const element = document.getElementById(`slide-${slideId}`);
  if (!element) {
    throw new Error(`Slide element not found: ${slideId}`);
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      width: 1080,
      height: 1350,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting slide:', error);
    throw error;
  }
}

export async function exportAllSlides(
  slides: Slide[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    onProgress?.(i + 1, slides.length);

    // Добавляем небольшую задержку между экспортами для стабильности
    await new Promise((resolve) => setTimeout(resolve, 500));

    await exportSlideAsPng(
      slide.id,
      `slide-${String(i + 1).padStart(2, '0')}-${slide.title.substring(0, 20).replace(/[^a-zа-яё0-9]/gi, '-')}.png`
    );
  }
}
