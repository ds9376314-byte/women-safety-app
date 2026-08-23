"use client";
import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await fetch("http://localhost:5000/api/admin/audit-logs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setLogs(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch audit logs", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  if (loading) return <div className="text-gray-500 font-medium">Loading audit logs...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1A365D] mb-8">System Audit Logs</h1>
      <p className="text-sm text-gray-500 mb-6">Immutable record of administrative actions.</p>
      
      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header">
              <th className="p-4 font-semibold text-gray-700">Timestamp</th>
              <th className="p-4 font-semibold text-gray-700">Admin</th>
              <th className="p-4 font-semibold text-gray-700">Action</th>
              <th className="p-4 font-semibold text-gray-700">Resource</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500 text-sm whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 font-medium text-gray-900">{log.adminId?.name || log.adminId?.email || 'Unknown'}</td>
                <td className="p-4 font-bold text-[#1A365D]">{log.action}</td>
                <td className="p-4 text-gray-600">{log.resourceType}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
