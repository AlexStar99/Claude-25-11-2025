// Типы данных для системы учёта финансов отеля на основе отчётов bnovo.ru

// Категории номеров
export type RoomCategory = 'Семейный' | 'Комфорт' | 'Стандарт' | 'Суммарный';

// Статистика номеров
export interface RoomStatistics {
  category: RoomCategory;
  totalRooms: number;
  available: number;
  booked: number;
  free: number;
  underRepair: number;
  withdrawn: number;
  occupancy: number; // Загрузка (%)
  adr: number; // Average Daily Rate
  revPAR: number; // Revenue Per Available Room
  checkIns: number; // Заездов
  checkOuts: number; // Выездов
}

// Статистика гостей
export interface GuestStatistics {
  category: RoomCategory;
  personNights: number; // Человеко/ночей
  adults: number;
  children: number;
  stayedGuests: number; // Проживало
  checkedIn: number; // Заехало
  checkedOut: number; // Выехало
  averageGuests: number; // В среднем человек
  revPAC: number; // Revenue Per Available Customer
  averageRate: number; // Средний тариф
}

// Изменения бронирований
export interface BookingChanges {
  category: RoomCategory;
  newBookings: number; // Создано бронирований
  newBookingsSum: number; // Сумма новых бронирований
  newBookingsCount: number; // Количество
  cancelled: number; // Отменено
  cancelledSum: number; // Сумма бронирований
  bookingsForPeriod: number; // Бронирований на период
  cancellationsForPeriod: number; // Отмен на период
  noShows: number; // Из них не явка
}

// Источники бронирований
export interface BookingSources {
  category: RoomCategory;
  direct: number; // Прямые бронирования
  company: number; // Компания
  agency: number; // Агентства
  ota: number; // OTA (Online Travel Agencies)
  module: number; // Модуль
}

// Доходы
export interface Income {
  category: RoomCategory;
  totalIncome: number; // Общая сумма
  direct: number; // Прямые
  company: number;
  agency: number;
  ota: number;
  otaRUB: number; // OTA, RUB
  module: number;
}

// Оплаты
export interface Payments {
  category: RoomCategory;
  weeklyLoad: number; // Загрузка за неделю
  weeklyLoadFuture: number; // Загрузка на неделю
  monthEndLoad: number; // До конца месяца
  checkInNights: number; // Заездов ночей
  checkInGuests: number; // Заездов человек
  checkOutNights: number; // Выездов ночей
  checkOutGuests: number; // Выездов человек
  periodNights: number; // За период ночей
  periodGuests: number; // За период человек
}

// Бухгалтерия
export interface Accounting {
  category: RoomCategory;
  arrivals: number; // Прилеты
  payments: number; // Платежи
  paymentsWithBooking: number; // Платежи по броне
  paymentsWithoutBooking: number; // Платежи без броне
  expenses: number; // Расходы
  refundsWithBooking: number; // Возвраты по броне
  refundsWithoutBooking: number; // Возвраты без броне
  debtStart: number; // Долгов на начало
  debtEnd: number; // Долгов на конец
  otherIncome: number; // Прочие поступления (не по бронированию)
  expensesOutsideBooking: number; // Расходы вне бронирования
}

// Общий дневной отчёт
export interface DailyReport {
  id: string;
  date: string; // Дата отчёта (ISO format)
  period: {
    from: string;
    to: string;
  };
  roomStatistics: RoomStatistics[];
  guestStatistics: GuestStatistics[];
  bookingChanges: BookingChanges[];
  bookingSources: BookingSources[];
  income: Income[];
  payments: Payments[];
  accounting: Accounting[];

  // Метаданные
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Сводная статистика для Dashboard
export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  occupancyRate: number;
  adr: number;
  revPAR: number;
  totalGuests: number;
  totalBookings: number;
  cancellationRate: number;
}

// Тип для выбора периода
export type PeriodType = 'day' | 'week' | 'month' | 'custom';

// Фильтры для отчётов
export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  categories?: RoomCategory[];
  periodType?: PeriodType;
}

// Тип для импорта данных
export interface ImportData {
  file?: File;
  rawData?: string;
  format: 'csv' | 'excel' | 'json' | 'manual';
}
