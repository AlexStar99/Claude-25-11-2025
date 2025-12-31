import type { DailyReport } from '../../types/hotelFinance';
import { FileText, Trash2, Calendar } from 'lucide-react';

interface ReportsListProps {
  reports: DailyReport[];
  selectedReport: DailyReport | null;
  onSelectReport: (report: DailyReport) => void;
  onDeleteReport: (reportId: string) => void;
}

export function ReportsList({
  reports,
  selectedReport,
  onSelectReport,
  onDeleteReport,
}: ReportsListProps) {
  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">
            Нет сохранённых отчётов. Импортируйте данные из bnovo.ru
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Список отчётов */}
      <div className="lg:col-span-1 space-y-3">
        <h2 className="text-lg font-semibold mb-4">Все отчёты ({reports.length})</h2>
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedReport?.id === report.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm font-medium">
                    {new Date(report.period.from).toLocaleDateString('ru-RU')} -{' '}
                    {new Date(report.period.to).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Создан:{' '}
                  {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {report.notes && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {report.notes}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm('Вы уверены, что хотите удалить этот отчёт?')
                  ) {
                    onDeleteReport(report.id);
                  }
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Детали выбранного отчёта */}
      <div className="lg:col-span-2">
        {selectedReport ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Детали отчёта</h2>

            {/* Период */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Период</h3>
              <p className="text-lg">
                {new Date(selectedReport.period.from).toLocaleDateString('ru-RU')} -{' '}
                {new Date(selectedReport.period.to).toLocaleDateString('ru-RU')}
              </p>
            </div>

            {/* Статистика номеров */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Статистика номеров
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Категория</th>
                      <th className="text-right py-2 px-2">Номеров</th>
                      <th className="text-right py-2 px-2">Заброни</th>
                      <th className="text-right py-2 px-2">Загрузка</th>
                      <th className="text-right py-2 px-2">ADR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.roomStatistics.map((stat) => (
                      <tr key={stat.category} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">{stat.category}</td>
                        <td className="text-right py-2 px-2">{stat.totalRooms}</td>
                        <td className="text-right py-2 px-2">{stat.booked}</td>
                        <td className="text-right py-2 px-2">
                          {stat.occupancy.toFixed(1)}%
                        </td>
                        <td className="text-right py-2 px-2">
                          {stat.adr.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Бухгалтерия */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Бухгалтерия
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Категория</th>
                      <th className="text-right py-2 px-2">Платежи</th>
                      <th className="text-right py-2 px-2">Расходы</th>
                      <th className="text-right py-2 px-2">Прибыль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.accounting.map((acc) => (
                      <tr key={acc.category} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">{acc.category}</td>
                        <td className="text-right py-2 px-2 text-green-600">
                          +{acc.payments.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="text-right py-2 px-2 text-red-600">
                          -{acc.expenses.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="text-right py-2 px-2 font-medium">
                          {(acc.payments - acc.expenses).toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Примечания */}
            {selectedReport.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Примечания
                </h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {selectedReport.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Выберите отчёт для просмотра деталей</p>
          </div>
        )}
      </div>
    </div>
  );
}
