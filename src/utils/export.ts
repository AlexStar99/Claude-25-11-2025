import { toPng } from 'html-to-image';
import type { Slide } from '../types';

export async function exportSlideAsPng(slideId: string, filename: string): Promise<void> {
  const element = document.getElementById(`slide-${slideId}`);
  if (!element) {
    const errorMsg = `Не удалось найти слайд для экспорта (ID: ${slideId}). Убедитесь, что слайд отображается на экране.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      width: 1080,
      height: 1350,
    });

    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      throw new Error('Не удалось сгенерировать изображение слайда');
    }

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();

    // Cleanup
    setTimeout(() => {
      link.remove();
    }, 100);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('Error exporting slide:', error);
    throw new Error(`Ошибка при экспорте слайда: ${errorMsg}`);
  }
}

export async function exportAllSlides(
  slides: Slide[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  if (!slides || slides.length === 0) {
    throw new Error('Нет слайдов для экспорта');
  }

  const errors: Array<{ index: number; title: string; error: string }> = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    onProgress?.(i + 1, slides.length);

    // Добавляем небольшую задержку между экспортами для стабильности
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Validate slide has title
      const title = slide.title || `untitled-${i + 1}`;
      const sanitizedTitle = title.substring(0, 20).replace(/[^a-zа-яё0-9]/gi, '-');
      const filename = `slide-${String(i + 1).padStart(2, '0')}-${sanitizedTitle}.png`;

      await exportSlideAsPng(slide.id, filename);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(`Failed to export slide ${i + 1}:`, error);
      errors.push({
        index: i + 1,
        title: slide.title || 'Без названия',
        error: errorMsg,
      });
      // Continue with next slide instead of stopping
    }
  }

  // Report errors if any occurred
  if (errors.length > 0) {
    const errorSummary = errors
      .map((e) => `Слайд ${e.index} (${e.title}): ${e.error}`)
      .join('\n');
    throw new Error(
      `Экспорт завершён с ошибками (${errors.length} из ${slides.length}):\n${errorSummary}`
    );
  }
}
