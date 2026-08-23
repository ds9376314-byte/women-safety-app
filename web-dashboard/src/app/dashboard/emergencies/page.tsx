"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../../../components/MapComponent'), { ssr: false });

export default function EmergenciesPage() {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmergencies = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await fetch(`http://localhost:5000/api/admin/emergencies?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setEmergencies(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch emergencies", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 10000); // Polling every 10s for EOC
    return () => clearInterval(interval);
  }, [filter]);

  const handleDispatchPolice = async (id: string) => {
    if (!window.confirm("Are you sure you want to dispatch police for this emergency?")) return;
    setActionLoading(id);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/emergencies/${id}/dispatch-police`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Police Dispatched!");
        setFilter('ACTIVE'); // Trigger re-fetch indirectly or let polling handle it
      }
    } catch (e) {
      console.error(e);
      alert("Failed to dispatch police");
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Session ID,User,Trigger Source,Started At,Status,Police Dispatched"];
    const rows = emergencies.map(s => `${s._id},${s.user?.name || 'Unknown'},${s.triggerSource},${new Date(s.startedAt).toISOString()},${s.status},${s.policeDispatched ? 'Yes' : 'No'}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `emergencies_${filter.toLowerCase()}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-gray-500 font-medium">Loading active emergencies...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#E53E3E]">Emergency Operations Center (EOC)</h1>
          <p className="text-gray-500 mt-1">Live tracking and management of emergency sessions</p>
        </div>
        <div className="flex items-center gap-2">
          {filter === 'ACTIVE' && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{filter === 'ACTIVE' ? 'Live Monitoring' : 'History'}</span>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button onClick={() => setFilter('ACTIVE')} className={`px-4 py-2 rounded-lg font-bold ${filter === 'ACTIVE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>Active Emergencies</button>
          <button onClick={() => setFilter('RESOLVED')} className={`px-4 py-2 rounded-lg font-bold ${filter === 'RESOLVED' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'}`}>Past / Resolved</button>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
          Download CSV
        </button>
      </div>
      
      {/* Map Section */}
      <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <MapComponent emergencies={emergencies} />
      </div>

      <h2 className="text-xl font-bold text-[#1A365D] mb-4">Incident Log</h2>
      <div className="card overflow-hidden border-red-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-50 border-b-2 border-red-100">
              <th className="p-4 font-semibold text-red-900">Session ID</th>
              <th className="p-4 font-semibold text-red-900">User</th>
              <th className="p-4 font-semibold text-red-900">Trigger Source</th>
              <th className="p-4 font-semibold text-red-900">Started At</th>
              <th className="p-4 font-semibold text-red-900">Status</th>
              <th className="p-4 font-semibold text-red-900">Authorities</th>
              <th className="p-4 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencies.map((session) => (
              <tr key={session._id} className="border-b border-gray-100 hover:bg-red-50/30 transition-colors">
                <td className="p-4 font-mono text-xs text-gray-500">{session._id}</td>
                <td className="p-4 font-bold text-gray-900">{session.user?.name || 'Unknown'}</td>
                <td className="p-4 text-gray-600">{session.triggerSource}</td>
                <td className="p-4 text-gray-900 font-medium">{new Date(session.startedAt).toLocaleTimeString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-white rounded text-xs font-black tracking-widest ${session.status === 'ACTIVE' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {session.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${session.policeDispatched ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                    {session.policeDispatched ? 'DISPATCHED' : 'PENDING'}
                  </span>
                </td>
                <td className="p-4">
                  {session.status === 'ACTIVE' && !session.policeDispatched && (
                    <button 
                      onClick={() => handleDispatchPolice(session._id)}
                      disabled={actionLoading === session._id}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded"
                    >
                      {actionLoading === session._id ? 'Sending...' : '🚨 Dispatch Police'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {emergencies.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <span className="text-green-600 font-bold text-lg block mb-2">{filter === 'ACTIVE' ? 'All Clear' : 'No Records'}</span>
                  <span className="text-gray-500">{filter === 'ACTIVE' ? 'There are no active emergency sessions.' : 'No resolved emergencies found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
