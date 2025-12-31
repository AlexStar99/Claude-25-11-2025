import { useState } from 'react';
import type { DailyReport, RoomCategory } from '../../types/hotelFinance';
import { Upload, Calendar, Plus } from 'lucide-react';

interface DataImportProps {
  onImport: (report: DailyReport) => void;
}

export function DataImport({ onImport }: DataImportProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [notes, setNotes] = useState('');

  // Данные для категорий номеров (исключая Суммарный, т.к. он вычисляется)
  type InputRoomCategory = Exclude<RoomCategory, 'Суммарный'>;

  const [roomCategories] = useState<InputRoomCategory[]>([
    'Семейный',
    'Комфорт',
    'Стандарт',
  ]);

  // Простые поля для ввода основных данных
  const [roomData, setRoomData] = useState<Record<InputRoomCategory, any>>({
    'Семейный': { totalRooms: 1, booked: 0, adr: 0, occupancy: 0 },
    'Комфорт': { totalRooms: 10, booked: 0, adr: 0, occupancy: 0 },
    'Стандарт': { totalRooms: 3, booked: 0, adr: 0, occupancy: 0 },
  });

  const [accountingData, setAccountingData] = useState<Record<InputRoomCategory, any>>({
    'Семейный': { payments: 0, expenses: 0 },
    'Комфорт': { payments: 0, expenses: 0 },
    'Стандарт': { payments: 0, expenses: 0 },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateFrom || !dateTo) {
      alert('Пожалуйста, укажите период отчёта');
      return;
    }

    // Создаём отчёт из введённых данных
    const report: DailyReport = {
      id: `report-${Date.now()}`,
      date: new Date().toISOString(),
      period: {
        from: dateFrom,
        to: dateTo,
      },
      roomStatistics: [
        ...roomCategories.map((cat) => ({
          category: cat,
          totalRooms: roomData[cat].totalRooms || 0,
          available: roomData[cat].totalRooms - roomData[cat].booked || 0,
          booked: roomData[cat].booked || 0,
          free: roomData[cat].totalRooms - roomData[cat].booked || 0,
          underRepair: 0,
          withdrawn: 0,
          occupancy: roomData[cat].occupancy || 0,
          adr: roomData[cat].adr || 0,
          revPAR: (roomData[cat].adr || 0) * (roomData[cat].occupancy || 0) / 100,
          checkIns: 0,
          checkOuts: 0,
        })),
        // Суммарный
        {
          category: 'Суммарный' as RoomCategory,
          totalRooms: roomCategories.reduce(
            (sum, cat) => sum + (roomData[cat].totalRooms || 0),
            0
          ),
          available: roomCategories.reduce(
            (sum, cat) => sum + (roomData[cat].totalRooms - roomData[cat].booked || 0),
            0
          ),
          booked: roomCategories.reduce(
            (sum, cat) => sum + (roomData[cat].booked || 0),
            0
          ),
          free: roomCategories.reduce(
            (sum, cat) => sum + (roomData[cat].totalRooms - roomData[cat].booked || 0),
            0
          ),
          underRepair: 0,
          withdrawn: 0,
          occupancy:
            roomCategories.reduce(
              (sum, cat) => sum + (roomData[cat].occupancy || 0),
              0
            ) / roomCategories.length,
          adr:
            roomCategories.reduce(
              (sum, cat) => sum + (roomData[cat].adr || 0),
              0
            ) / roomCategories.length,
          revPAR: 0,
          checkIns: 0,
          checkOuts: 0,
        },
      ],
      guestStatistics: roomCategories.map((cat) => ({
        category: cat,
        personNights: 0,
        adults: 0,
        children: 0,
        stayedGuests: 0,
        checkedIn: 0,
        checkedOut: 0,
        averageGuests: 0,
        revPAC: 0,
        averageRate: roomData[cat].adr || 0,
      })),
      bookingChanges: roomCategories.map((cat) => ({
        category: cat,
        newBookings: 0,
        newBookingsSum: 0,
        newBookingsCount: 0,
        cancelled: 0,
        cancelledSum: 0,
        bookingsForPeriod: 0,
        cancellationsForPeriod: 0,
        noShows: 0,
      })),
      bookingSources: roomCategories.map((cat) => ({
        category: cat,
        direct: 0,
        company: 0,
        agency: 0,
        ota: 0,
        module: 0,
      })),
      income: roomCategories.map((cat) => ({
        category: cat,
        totalIncome: accountingData[cat].payments || 0,
        direct: 0,
        company: 0,
        agency: 0,
        ota: 0,
        otaRUB: 0,
        module: 0,
      })),
      payments: roomCategories.map((cat) => ({
        category: cat,
        weeklyLoad: 0,
        weeklyLoadFuture: 0,
        monthEndLoad: 0,
        checkInNights: 0,
        checkInGuests: 0,
        checkOutNights: 0,
        checkOutGuests: 0,
        periodNights: 0,
        periodGuests: 0,
      })),
      accounting: [
        ...roomCategories.map((cat) => ({
          category: cat,
          arrivals: 0,
          payments: accountingData[cat].payments || 0,
          paymentsWithBooking: accountingData[cat].payments || 0,
          paymentsWithoutBooking: 0,
          expenses: accountingData[cat].expenses || 0,
          refundsWithBooking: 0,
          refundsWithoutBooking: 0,
          debtStart: 0,
          debtEnd: 0,
          otherIncome: 0,
          expensesOutsideBooking: 0,
        })),
        // Суммарный
        {
          category: 'Суммарный' as RoomCategory,
          arrivals: 0,
          payments: roomCategories.reduce(
            (sum, cat) => sum + (accountingData[cat].payments || 0),
            0
          ),
          paymentsWithBooking: roomCategories.reduce(
            (sum, cat) => sum + (accountingData[cat].payments || 0),
            0
          ),
          paymentsWithoutBooking: 0,
          expenses: roomCategories.reduce(
            (sum, cat) => sum + (accountingData[cat].expenses || 0),
            0
          ),
          refundsWithBooking: 0,
          refundsWithoutBooking: 0,
          debtStart: 0,
          debtEnd: 0,
          otherIncome: 0,
          expensesOutsideBooking: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
    };

    onImport(report);

    // Сброс формы
    setDateFrom('');
    setDateTo('');
    setNotes('');
    setRoomData({
      'Семейный': { totalRooms: 1, booked: 0, adr: 0, occupancy: 0 },
      'Комфорт': { totalRooms: 10, booked: 0, adr: 0, occupancy: 0 },
      'Стандарт': { totalRooms: 3, booked: 0, adr: 0, occupancy: 0 },
    } as Record<InputRoomCategory, any>);
    setAccountingData({
      'Семейный': { payments: 0, expenses: 0 },
      'Комфорт': { payments: 0, expenses: 0 },
      'Стандарт': { payments: 0, expenses: 0 },
    } as Record<InputRoomCategory, any>);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="text-blue-500" size={24} />
          <h2 className="text-xl font-semibold">Импорт данных из bnovo.ru</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Период отчёта */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Дата начала периода
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Дата окончания периода
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Данные по категориям номеров */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Статистика по номерам</h3>
            {roomCategories.map((category) => (
              <div
                key={category}
                className="mb-4 p-4 border rounded-lg bg-gray-50"
              >
                <h4 className="font-medium mb-3">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Всего номеров
                    </label>
                    <input
                      type="number"
                      value={roomData[category].totalRooms}
                      onChange={(e) =>
                        setRoomData({
                          ...roomData,
                          [category]: {
                            ...roomData[category],
                            totalRooms: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Заброни
                    </label>
                    <input
                      type="number"
                      value={roomData[category].booked}
                      onChange={(e) =>
                        setRoomData({
                          ...roomData,
                          [category]: {
                            ...roomData[category],
                            booked: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Загрузка (%)
                    </label>
                    <input
                      type="number"
                      value={roomData[category].occupancy}
                      onChange={(e) =>
                        setRoomData({
                          ...roomData,
                          [category]: {
                            ...roomData[category],
                            occupancy: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      ADR (₽)
                    </label>
                    <input
                      type="number"
                      value={roomData[category].adr}
                      onChange={(e) =>
                        setRoomData({
                          ...roomData,
                          [category]: {
                            ...roomData[category],
                            adr: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Бухгалтерия */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Бухгалтерия</h3>
            {roomCategories.map((category) => (
              <div
                key={category}
                className="mb-4 p-4 border rounded-lg bg-gray-50"
              >
                <h4 className="font-medium mb-3">{category}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Платежи (₽)
                    </label>
                    <input
                      type="number"
                      value={accountingData[category].payments}
                      onChange={(e) =>
                        setAccountingData({
                          ...accountingData,
                          [category]: {
                            ...accountingData[category],
                            payments: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Расходы (₽)
                    </label>
                    <input
                      type="number"
                      value={accountingData[category].expenses}
                      onChange={(e) =>
                        setAccountingData({
                          ...accountingData,
                          [category]: {
                            ...accountingData[category],
                            expenses: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Примечания */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечания
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Добавьте заметки к отчёту (опционально)"
            />
          </div>

          {/* Кнопка отправки */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              Создать отчёт
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
