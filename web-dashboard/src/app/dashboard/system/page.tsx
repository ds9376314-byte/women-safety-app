"use client";
import { useEffect, useState } from "react";

export default function SystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const [healthRes, incidentRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/system/health", { headers }),
          fetch("http://localhost:5000/api/admin/system/incidents", { headers })
        ]);
        
        if (healthRes.ok) setHealth(await healthRes.json());
        if (incidentRes.ok) setIncidents(await incidentRes.json());
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchData();
    const int = setInterval(fetchData, 15000);
    return () => clearInterval(int);
  }, []);

  if (!health) return <div>Loading system status...</div>;

  const StatusCard = ({ title, status }: { title: string, status: string }) => (
    <div className={`p-6 rounded-xl border ${status === 'HEALTHY' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <h3 className="font-bold text-gray-700">{title}</h3>
      <p className={`text-xl font-black mt-2 ${status === 'HEALTHY' ? 'text-green-600' : 'text-red-600'}`}>{status}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1A365D] mb-8">System Health & Incidents</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatusCard title="Database" status={health.database} />
        <StatusCard title="API Services" status={health.api} />
        <StatusCard title="Authentication" status={health.authentication} />
        <StatusCard title="WebSockets" status={health.websocket} />
      </div>

      <h2 className="text-xl font-bold mb-4">System Incidents</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Incident</th>
              <th className="p-4">Service</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc._id} className="border-b">
                <td className="p-4 font-bold">{inc.title}</td>
                <td className="p-4 text-sm">{inc.affectedService}</td>
                <td className="p-4 text-sm font-bold text-red-500">{inc.severity}</td>
                <td className="p-4 text-sm">{inc.status}</td>
              </tr>
            ))}
            {incidents.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No active incidents.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
