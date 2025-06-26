import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import systemAdminMockApi from '../../services/systemAdminMockApi';
import { BarChart3, FileText, Download } from 'lucide-react';

const GlobalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('');

  // Example summary stats (could be fetched from API)
  const summaryStats = [
    { label: 'Total Reports', value: reports.length, icon: FileText },
    { label: 'Types', value: [...new Set(reports.map(r => r.type))].length, icon: BarChart3 },
  ];

  // Fetch reports
  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await systemAdminMockApi.listReports(filter);
      setReports(res.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [filter]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
        Global Reports
      </h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {summaryStats.map(stat => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4 flex items-center">
            <stat.icon className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-3 py-1 rounded w-64"
        />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center">
                  <FileText className="h-4 w-4 text-blue-400 mr-2" />
                  {report.name}
                </td>
                <td className="px-4 py-2 capitalize">{report.type.replace('_', ' ')}</td>
                <td className="px-4 py-2">{new Date(report.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <button onClick={() => setSelectedReport(report)} className="text-blue-600 hover:underline mr-2">View</button>
                  <button onClick={() => toast('Download coming soon!')} className="text-green-600 hover:underline flex items-center"><Download className="h-4 w-4 mr-1" />Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">{selectedReport.name}</h2>
            <div className="mb-2"><b>Type:</b> {selectedReport.type}</div>
            <div className="mb-2"><b>Created:</b> {new Date(selectedReport.createdAt).toLocaleString()}</div>
            <div className="mb-2"><b>Description:</b> {selectedReport.description}</div>
            <div className="mb-2"><b>Data:</b></div>
            <pre className="bg-gray-100 p-2 rounded text-xs max-h-40 overflow-auto">{JSON.stringify(selectedReport.data, null, 2)}</pre>
            <div className="flex justify-end mt-4">
              <button onClick={() => setSelectedReport(null)} className="px-3 py-1 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalReports; 