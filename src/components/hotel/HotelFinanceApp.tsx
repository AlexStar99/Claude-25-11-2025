import { useState } from 'react';
import type { DailyReport } from '../../types/hotelFinance';
import { Dashboard } from './Dashboard';
import { ReportsList } from './ReportsList';
import { DataImport } from './DataImport';
import { DetailedReports } from './DetailedReports';
import { BarChart3, FileText, Upload, Settings } from 'lucide-react';

type Tab = 'dashboard' | 'reports' | 'import' | 'detailed';

export function HotelFinanceApp() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  // Загрузка данных из localStorage при монтировании
  useState(() => {
    const savedReports = localStorage.getItem('hotelReports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (error) {
        console.error('Error loading reports from localStorage:', error);
      }
    }
  });

  const handleImportData = (newReport: DailyReport) => {
    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('hotelReports', JSON.stringify(updatedReports));
    setActiveTab('dashboard');
  };

  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(r => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('hotelReports', JSON.stringify(updatedReports));
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
    { id: 'reports' as Tab, label: 'Отчёты', icon: FileText },
    { id: 'detailed' as Tab, label: 'Детальный анализ', icon: Settings },
    { id: 'import' as Tab, label: 'Импорт данных', icon: Upload },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Учёт финансов отеля
            </h1>
            <p className="text-sm text-gray-600">
              Система ежедневного учёта на основе отчётов bnovo.ru
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Отчётов: <span className="font-semibold text-gray-900">{reports.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === 'dashboard' && (
          <Dashboard reports={reports} />
        )}

        {activeTab === 'reports' && (
          <ReportsList
            reports={reports}
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {activeTab === 'detailed' && (
          <DetailedReports
            reports={reports}
            selectedReport={selectedReport}
          />
        )}

        {activeTab === 'import' && (
          <DataImport onImport={handleImportData} />
        )}
      </main>
    </div>
  );
}
