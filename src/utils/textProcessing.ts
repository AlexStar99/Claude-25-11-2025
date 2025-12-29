// Список висячих предлогов и союзов для русского языка
const HANGING_WORDS = [
  'и', 'а', 'но', 'да', 'или', 'либо',
  'в', 'на', 'с', 'к', 'о', 'об', 'от', 'до', 'из', 'за', 'по', 'у', 'без', 'для', 'при', 'через', 'про', 'под',
  'не', 'ни', 'бы', 'же', 'ли',
  'что', 'как', 'чтобы', 'если', 'когда', 'где', 'куда', 'откуда', 'зачем', 'почему'
];

/**
 * Убирает висячие предлоги и союзы в конце строк
 */
export function removeHangingWords(text: string): string {
  // Input validation
  if (text == null || typeof text !== 'string') {
    console.warn('removeHangingWords: Invalid input, expected string');
    return '';
  }

  if (text.trim() === '') {
    return text;
  }

  try {
    const lines = text.split('\n');
    return lines.map(line => {
      const words = line.trim().split(/\s+/);
      if (words.length < 2) return line;

      const lastWord = words[words.length - 1].toLowerCase();
      if (HANGING_WORDS.includes(lastWord)) {
        // Переносим последнее слово на следующую строку
        return words.slice(0, -1).join(' ') + '\n' + lastWord;
      }
      return line;
    }).join('\n');
  } catch (error) {
    console.error('Error in removeHangingWords:', error);
    return text; // Return original text if processing fails
  }
}

/**
 * Разбивает сырой текст на слайды по структуре
 * Формат: Заголовок (###) → Подзаголовок (##) → Тело текста
 */
export function parseTextToSlides(rawText: string): Array<{
  title: string;
  subtitle: string;
  body: string;
}> {
  // Input validation
  if (rawText == null || typeof rawText !== 'string') {
    console.warn('parseTextToSlides: Invalid input, expected string');
    return [];
  }

  if (rawText.trim() === '') {
    return [];
  }

  try {
    const slides: Array<{ title: string; subtitle: string; body: string }> = [];
    const lines = rawText.split('\n').filter(line => line.trim());

    let currentSlide = { title: '', subtitle: '', body: '' };
    let bodyLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Заголовок слайда (начинается с ###)
      if (trimmedLine.startsWith('###')) {
        // Сохраняем предыдущий слайд
        if (currentSlide.title || currentSlide.subtitle || bodyLines.length > 0) {
          currentSlide.body = removeHangingWords(bodyLines.join('\n'));
          slides.push(currentSlide);
          currentSlide = { title: '', subtitle: '', body: '' };
          bodyLines = [];
        }
        currentSlide.title = trimmedLine.replace(/^###\s*/, '');
      }
      // Подзаголовок (начинается с ##)
      else if (trimmedLine.startsWith('##')) {
        currentSlide.subtitle = trimmedLine.replace(/^##\s*/, '');
      }
      // Обычный текст
      else if (trimmedLine.length > 0) {
        bodyLines.push(trimmedLine);
      }
    }

    // Сохраняем последний слайд
    if (currentSlide.title || currentSlide.subtitle || bodyLines.length > 0) {
      currentSlide.body = removeHangingWords(bodyLines.join('\n'));
      slides.push(currentSlide);
    }

    return slides;
  } catch (error) {
    console.error('Error in parseTextToSlides:', error);
    throw new Error(`Не удалось распарсить текст: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
  }
}

/**
 * Генерирует случайное смещение в заданных пределах
 */
export function getRandomOffset(min: number, max: number): number {
  // Input validation
  if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
    console.warn('getRandomOffset: Invalid input, expected numbers');
    return 0;
  }

  if (min > max) {
    console.warn('getRandomOffset: min is greater than max, swapping values');
    [min, max] = [max, min];
  }

  return Math.random() * (max - min) + min;
}

/**
 * Генерирует случайный поворот в безопасных пределах
 */
export function getRandomRotation(): number {
  return getRandomOffset(-3, 3); // От -3 до 3 градусов
}
