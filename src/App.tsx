import { useState } from 'react';
import { Slide } from './types';
import { SlidePreview } from './components/SlidePreview';
import { SlideEditor } from './components/SlideEditor';
import { BulkGenerator } from './components/BulkGenerator';
import { exportAllSlides } from './utils/export';
import { Download, Plus } from 'lucide-react';

// Примеры данных на русском
const EXAMPLE_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'Создавайте красивые карусели',
    subtitle: 'Для Instagram за минуты',
    body: 'Используйте наш генератор для создания профессиональных слайдов с минималистичным дизайном и поддержкой русского языка.',
    layoutId: 'centered',
    fontSize: 28,
  },
  {
    id: 'slide-2',
    title: '4 уникальных макета',
    subtitle: 'Выберите стиль под ваш контент',
    body: 'Каждый макет имеет свои особенности:\n\n• Центрированный - классика\n• Слева - для акцента\n• Разделённый - структурность\n• Угловой - современность',
    layoutId: 'left',
    fontSize: 26,
  },
  {
    id: 'slide-3',
    title: 'Автоматизация',
    subtitle: 'Bulk Generator',
    body: 'Вставьте весь текст сразу - система автоматически разобьёт его на слайды и уберёт висячие предлоги.',
    layoutId: 'split',
    fontSize: 28,
  },
];

function App() {
  const [slides, setSlides] = useState<Slide[]>(EXAMPLE_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });

  const currentSlide = slides[currentSlideIndex];

  const handleUpdateSlide = (updatedSlide: Slide) => {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === updatedSlide.id ? updatedSlide : slide))
    );
  };

  const handleDeleteSlide = () => {
    if (slides.length === 1) {
      alert('Нельзя удалить последний слайд');
      return;
    }

    setSlides((prev) => prev.filter((slide) => slide.id !== currentSlide.id));
    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: 'Новый слайд',
      subtitle: 'Подзаголовок',
      body: 'Добавьте текст вашего слайда здесь',
      layoutId: 'centered',
      fontSize: 28,
    };

    setSlides((prev) => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleBulkGenerate = (newSlides: Slide[]) => {
    if (newSlides.length === 0) return;

    const confirmReplace = window.confirm(
      `Это заменит текущие ${slides.length} слайд(ов) на ${newSlides.length} новых. Продолжить?`
    );

    if (confirmReplace) {
      setSlides(newSlides);
      setCurrentSlideIndex(0);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    setExportProgress({ current: 0, total: slides.length });

    try {
      await exportAllSlides(slides, (current, total) => {
        setExportProgress({ current, total });
      });

      alert('Все слайды успешно экспортированы!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте слайдов');
    } finally {
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Instagram Carousel Generator</h1>
          <p className="text-sm text-gray-600">Создавайте красивые карусели для Instagram</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus size={20} />
            Добавить слайд
          </button>

          <button
            onClick={handleExportAll}
            disabled={isExporting || slides.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={20} />
            {isExporting
              ? `Экспорт ${exportProgress.current}/${exportProgress.total}...`
              : `Скачать все (${slides.length})`}
          </button>
        </div>
      </header>

      {/* Bulk Generator */}
      <BulkGenerator onGenerate={handleBulkGenerate} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1">
          {currentSlide ? (
            <SlidePreview
              slide={currentSlide}
              onNavigate={(direction) => {
                if (direction === 'prev' && currentSlideIndex > 0) {
                  setCurrentSlideIndex(currentSlideIndex - 1);
                } else if (direction === 'next' && currentSlideIndex < slides.length - 1) {
                  setCurrentSlideIndex(currentSlideIndex + 1);
                }
              }}
              canNavigatePrev={currentSlideIndex > 0}
              canNavigateNext={currentSlideIndex < slides.length - 1}
              currentIndex={currentSlideIndex}
              totalSlides={slides.length}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Нет слайдов. Создайте новый слайд или используйте генератор.
            </div>
          )}
        </div>

        {/* Slide Editor Sidebar */}
        {currentSlide && (
          <SlideEditor
            slide={currentSlide}
            onUpdate={handleUpdateSlide}
            onDelete={handleDeleteSlide}
          />
        )}
      </div>
    </div>
  );
}

export default App;
