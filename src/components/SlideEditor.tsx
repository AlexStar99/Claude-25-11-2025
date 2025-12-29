import { useRef } from 'react';
import { Slide } from '../types';
import { layouts } from '../layouts/layouts';
import { Upload, Image as ImageIcon, Type, Layout, Trash2 } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
  onDelete: () => void;
}

export function SlideEditor({ slide, onUpdate, onDelete }: SlideEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onUpdate({ ...slide, backgroundImage: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onUpdate({ ...slide, backgroundImage: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-96 bg-white border-l h-full overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-2">Редактор слайда</h2>
        <p className="text-sm text-gray-600">Настройте содержимое и оформление</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Текст заголовка */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Type size={16} />
            Заголовок
          </label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Введите заголовок"
          />
        </div>

        {/* Подзаголовок */}
        <div>
          <label className="block text-sm font-medium mb-2">Подзаголовок</label>
          <input
            type="text"
            value={slide.subtitle}
            onChange={(e) => onUpdate({ ...slide, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Введите подзаголовок"
          />
        </div>

        {/* Тело текста */}
        <div>
          <label className="block text-sm font-medium mb-2">Текст</label>
          <textarea
            value={slide.body}
            onChange={(e) => onUpdate({ ...slide, body: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            rows={6}
            placeholder="Введите основной текст"
          />
        </div>

        {/* Размер шрифта */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Размер шрифта: {slide.fontSize || 28}px
          </label>
          <input
            type="range"
            min="12"
            max="48"
            value={slide.fontSize || 28}
            onChange={(e) => onUpdate({ ...slide, fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Выбор макета */}
        <div>
          <label className="block text-sm font-medium mb-3 flex items-center gap-2">
            <Layout size={16} />
            Макет
          </label>
          <div className="grid grid-cols-2 gap-2">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => onUpdate({ ...slide, layoutId: layout.id })}
                className={`p-3 border rounded-lg text-sm transition-all ${
                  slide.layoutId === layout.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {layout.name}
              </button>
            ))}
          </div>
        </div>

        {/* Фоновое изображение */}
        <div>
          <label className="block text-sm font-medium mb-3 flex items-center gap-2">
            <ImageIcon size={16} />
            Фоновое изображение
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {slide.backgroundImage ? (
              <div className="space-y-2">
                <img
                  src={slide.backgroundImage}
                  alt="Background preview"
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...slide, backgroundImage: undefined });
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Удалить изображение
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto text-gray-400" size={32} />
                <p className="text-sm text-gray-600">
                  Перетащите изображение или нажмите для выбора
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Удалить слайд */}
        <div className="pt-4 border-t">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Удалить слайд
          </button>
        </div>
      </div>
    </div>
  );
}
