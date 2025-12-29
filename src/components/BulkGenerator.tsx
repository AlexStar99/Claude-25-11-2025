import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { parseTextToSlides } from '../utils/textProcessing';
import type { Slide } from '../types';

interface BulkGeneratorProps {
  onGenerate: (slides: Slide[]) => void;
}

const EXAMPLE_TEXT = `### Как создать идеальный контент
## 5 простых шагов
Следуя этим рекомендациям, вы сможете создавать контент, который действительно работает и приносит результаты вашему бизнесу.

### Шаг 1: Изучите аудиторию
## Кто ваши читатели?
Прежде чем создавать контент, важно понять, для кого вы пишете. Исследуйте интересы, боли и желания вашей целевой аудитории.

### Шаг 2: Создайте ценность
## Решайте проблемы
Ваш контент должен помогать читателям решать их проблемы. Не просто рассказывайте о продукте, показывайте как он улучшит их жизнь.

### Шаг 3: Будьте последовательны
## Регулярность важна
Публикуйте контент регулярно. Создайте контент-план и придерживайтесь его. Это поможет вам оставаться на радаре вашей аудитории.`;

export function BulkGenerator({ onGenerate }: BulkGeneratorProps) {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;

    const parsedSlides = parseTextToSlides(text);
    const slides: Slide[] = parsedSlides.map((slide, index) => ({
      id: `slide-${Date.now()}-${index}`,
      title: slide.title,
      subtitle: slide.subtitle,
      body: slide.body,
      layoutId: ['centered', 'left', 'split', 'corner'][index % 4],
      fontSize: 28,
    }));

    onGenerate(slides);
    setIsExpanded(false);
  };

  const handleLoadExample = () => {
    setText(EXAMPLE_TEXT);
  };

  return (
    <div className="bg-white border-b">
      {!isExpanded ? (
        <div className="p-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Sparkles size={20} />
            Создать слайды из текста
          </button>
        </div>
      ) : (
        <div className="p-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} />
              Генератор слайдов
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Свернуть
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Вставьте текст в формате:
              <code className="mx-1 px-2 py-1 bg-gray-100 rounded">### Заголовок</code>
              <code className="mx-1 px-2 py-1 bg-gray-100 rounded">## Подзаголовок</code>
              <span className="ml-1">Тело текста</span>
            </p>
            <button
              onClick={handleLoadExample}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Загрузить пример
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставьте сюда ваш текст..."
            className="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleGenerate}
              disabled={!text.trim()}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Создать слайды
            </button>
            <button
              onClick={() => {
                setText('');
                setIsExpanded(false);
              }}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>

          {text && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                Будет создано слайдов: {parseTextToSlides(text).length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
