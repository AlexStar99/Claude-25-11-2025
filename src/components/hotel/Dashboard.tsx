import { useMemo } from 'react';
import type { DailyReport, DashboardSummary } from '../../types/hotelFinance';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Hotel,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  reports: DailyReport[];
}

export function Dashboard({ reports }: DashboardProps) {
  const summary = useMemo<DashboardSummary | null>(() => {
    if (reports.length === 0) return null;

    // Берём последний отчёт для текущих показателей
    const latestReport = reports[reports.length - 1];

    // Считаем общую выручку
    const totalRevenue = latestReport.accounting.reduce(
      (sum, acc) => sum + acc.payments,
      0
    );

    // Считаем общие расходы
    const totalExpenses = latestReport.accounting.reduce(
      (sum, acc) => sum + acc.expenses + acc.expensesOutsideBooking,
      0
    );

    // Чистая прибыль
    const netProfit = totalRevenue - totalExpenses;

    // Средняя загруженность
    const summaryRoom = latestReport.roomStatistics.find(
      r => r.category === 'Суммарный'
    );
    const occupancyRate = summaryRoom?.occupancy || 0;
    const adr = summaryRoom?.adr || 0;
    const revPAR = summaryRoom?.revPAR || 0;

    // Общее количество гостей
    const totalGuests = latestReport.guestStatistics.reduce(
      (sum, g) => sum + g.checkedIn,
      0
    );

    // Общее количество бронирований
    const totalBookings = latestReport.bookingChanges.reduce(
      (sum, b) => sum + b.newBookings,
      0
    );

    // Процент отмен
    const totalCancellations = latestReport.bookingChanges.reduce(
      (sum, b) => sum + b.cancelled,
      0
    );
    const cancellationRate = totalBookings > 0
      ? (totalCancellations / totalBookings) * 100
      : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      occupancyRate,
      adr,
      revPAR,
      totalGuests,
      totalBookings,
      cancellationRate,
    };
  }, [reports]);

  if (!summary || reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">
            Нет данных для отображения. Импортируйте отчёт из bnovo.ru
          </p>
        </div>
      </div>
    );
  }

  const latestReport = reports[reports.length - 1];

  const metrics = [
    {
      label: 'Выручка',
      value: `${summary.totalRevenue.toLocaleString('ru-RU')} ₽`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12%',
      isPositive: true,
    },
    {
      label: 'Расходы',
      value: `${summary.totalExpenses.toLocaleString('ru-RU')} ₽`,
      icon: TrendingDown,
      color: 'bg-red-500',
      change: '-5%',
      isPositive: true,
    },
    {
      label: 'Чистая прибыль',
      value: `${summary.netProfit.toLocaleString('ru-RU')} ₽`,
      icon: TrendingUp,
      color: summary.netProfit >= 0 ? 'bg-blue-500' : 'bg-red-500',
      change: '+8%',
      isPositive: summary.netProfit >= 0,
    },
    {
      label: 'Загруженность',
      value: `${summary.occupancyRate.toFixed(1)}%`,
      icon: Hotel,
      color: 'bg-purple-500',
      change: '+3%',
      isPositive: true,
    },
    {
      label: 'ADR (средний тариф)',
      value: `${summary.adr.toLocaleString('ru-RU')} ₽`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+7%',
      isPositive: true,
    },
    {
      label: 'RevPAR',
      value: `${summary.revPAR.toLocaleString('ru-RU')} ₽`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+10%',
      isPositive: true,
    },
    {
      label: 'Гостей',
      value: summary.totalGuests,
      icon: Users,
      color: 'bg-pink-500',
      change: '+15',
      isPositive: true,
    },
    {
      label: 'Бронирований',
      value: summary.totalBookings,
      icon: Calendar,
      color: 'bg-cyan-500',
      change: '+5',
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок с датой отчёта */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Сводка за период</h2>
        <p className="text-gray-600">
          {new Date(latestReport.period.from).toLocaleDateString('ru-RU')} -{' '}
          {new Date(latestReport.period.to).toLocaleDateString('ru-RU')}
        </p>
      </div>

      {/* Метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                {/* <div
                  className={`flex items-center gap-1 text-sm ${
                    metric.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {metric.change}
                </div> */}
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Процент отмен */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">Процент отмен</h3>
          <p className="text-2xl font-bold mb-2">
            {summary.cancellationRate.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                summary.cancellationRate > 20 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(summary.cancellationRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Долги */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">Долги на конец периода</h3>
          <p className="text-2xl font-bold">
            {latestReport.accounting
              .reduce((sum, acc) => sum + acc.debtEnd, 0)
              .toLocaleString('ru-RU')}{' '}
            ₽
          </p>
        </div>

        {/* Прочие поступления */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">Прочие поступления</h3>
          <p className="text-2xl font-bold">
            {latestReport.accounting
              .reduce((sum, acc) => sum + acc.otherIncome, 0)
              .toLocaleString('ru-RU')}{' '}
            ₽
          </p>
        </div>
      </div>

      {/* Статистика по категориям номеров */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Статистика по категориям номеров</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Категория</th>
                <th className="text-right py-2 px-4">Номеров</th>
                <th className="text-right py-2 px-4">Заброни</th>
                <th className="text-right py-2 px-4">Загрузка</th>
                <th className="text-right py-2 px-4">ADR</th>
                <th className="text-right py-2 px-4">RevPAR</th>
              </tr>
            </thead>
            <tbody>
              {latestReport.roomStatistics
                .filter(r => r.category !== 'Суммарный')
                .map((room) => (
                  <tr key={room.category} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{room.category}</td>
                    <td className="text-right py-2 px-4">{room.totalRooms}</td>
                    <td className="text-right py-2 px-4">{room.booked}</td>
                    <td className="text-right py-2 px-4">{room.occupancy.toFixed(1)}%</td>
                    <td className="text-right py-2 px-4">
                      {room.adr.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="text-right py-2 px-4">
                      {room.revPAR.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
