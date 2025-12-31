import type { DailyReport } from '../../types/hotelFinance';
import { BarChart, TrendingUp, AlertCircle } from 'lucide-react';

interface DetailedReportsProps {
  reports: DailyReport[];
  selectedReport: DailyReport | null;
}

export function DetailedReports({ reports, selectedReport }: DetailedReportsProps) {
  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">
            Нет данных для анализа. Импортируйте отчёты из bnovo.ru
          </p>
        </div>
      </div>
    );
  }

  const reportToAnalyze = selectedReport || reports[reports.length - 1];

  // Вычисляем сравнение с предыдущим периодом (если есть)
  const previousReport = reports.length > 1 ? reports[reports.length - 2] : null;

  const calculateChange = (current: number, previous: number | null) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const currentRevenue = reportToAnalyze.accounting.reduce(
    (sum, acc) => sum + acc.payments,
    0
  );
  const previousRevenue = previousReport
    ? previousReport.accounting.reduce((sum, acc) => sum + acc.payments, 0)
    : null;
  const revenueChange = calculateChange(currentRevenue, previousRevenue);

  const currentOccupancy =
    reportToAnalyze.roomStatistics.find((r) => r.category === 'Суммарный')
      ?.occupancy || 0;
  const previousOccupancy = previousReport
    ? previousReport.roomStatistics.find((r) => r.category === 'Суммарный')
        ?.occupancy || 0
    : null;
  const occupancyChange = calculateChange(currentOccupancy, previousOccupancy);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <BarChart className="text-blue-500" size={24} />
          <h2 className="text-xl font-semibold">Детальный анализ</h2>
        </div>
        <p className="text-gray-600">
          Период:{' '}
          {new Date(reportToAnalyze.period.from).toLocaleDateString('ru-RU')} -{' '}
          {new Date(reportToAnalyze.period.to).toLocaleDateString('ru-RU')}
        </p>
      </div>

      {/* Сравнение с предыдущим периодом */}
      {previousReport && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Сравнение с предыдущим периодом
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Изменение выручки</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {currentRevenue.toLocaleString('ru-RU')} ₽
                </p>
                {revenueChange !== null && (
                  <span
                    className={`flex items-center text-sm ${
                      revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendingUp size={16} />
                    {revenueChange >= 0 ? '+' : ''}
                    {revenueChange.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                Изменение загруженности
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{currentOccupancy.toFixed(1)}%</p>
                {occupancyChange !== null && (
                  <span
                    className={`flex items-center text-sm ${
                      occupancyChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendingUp size={16} />
                    {occupancyChange >= 0 ? '+' : ''}
                    {occupancyChange.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Детальная статистика по категориям */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Полная статистика по категориям номеров
        </h3>
        <div className="space-y-4">
          {reportToAnalyze.roomStatistics
            .filter((r) => r.category !== 'Суммарный')
            .map((room) => {
              const accounting = reportToAnalyze.accounting.find(
                (a) => a.category === room.category
              );
              const profit = accounting
                ? accounting.payments - accounting.expenses
                : 0;

              return (
                <div key={room.category} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3">{room.category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Всего номеров</p>
                      <p className="text-lg font-semibold">{room.totalRooms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Заброни</p>
                      <p className="text-lg font-semibold">{room.booked}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Загруженность</p>
                      <p className="text-lg font-semibold">
                        {room.occupancy.toFixed(1)}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${room.occupancy}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">ADR</p>
                      <p className="text-lg font-semibold">
                        {room.adr.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">RevPAR</p>
                      <p className="text-lg font-semibold">
                        {room.revPAR.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Платежи</p>
                      <p className="text-lg font-semibold text-green-600">
                        +{accounting?.payments.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Расходы</p>
                      <p className="text-lg font-semibold text-red-600">
                        -{accounting?.expenses.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Прибыль</p>
                      <p
                        className={`text-lg font-semibold ${
                          profit >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}
                      >
                        {profit.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Дополнительные метрики */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Дополнительные показатели</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Общие заезды</p>
            <p className="text-2xl font-bold">
              {reportToAnalyze.roomStatistics.reduce(
                (sum, r) => sum + r.checkIns,
                0
              )}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Общие выезды</p>
            <p className="text-2xl font-bold">
              {reportToAnalyze.roomStatistics.reduce(
                (sum, r) => sum + r.checkOuts,
                0
              )}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Долги на конец периода</p>
            <p className="text-2xl font-bold">
              {reportToAnalyze.accounting
                .reduce((sum, acc) => sum + acc.debtEnd, 0)
                .toLocaleString('ru-RU')}{' '}
              ₽
            </p>
          </div>
        </div>
      </div>

      {/* График загруженности (простая визуализация) */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Загруженность по категориям
        </h3>
        <div className="space-y-3">
          {reportToAnalyze.roomStatistics
            .filter((r) => r.category !== 'Суммарный')
            .map((room) => (
              <div key={room.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{room.category}</span>
                  <span className="text-gray-600">
                    {room.booked} / {room.totalRooms} ({room.occupancy.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${room.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
