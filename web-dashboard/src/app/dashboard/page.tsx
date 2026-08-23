"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setMetrics(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch metrics", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);

  if (loading) return <div className="text-gray-500 font-medium">Loading metrics...</div>;
  if (!metrics) return <div className="text-red-500 font-medium">Failed to load dashboard.</div>;

  const trendData = [
    { name: 'Mon', alerts: 4 },
    { name: 'Tue', alerts: 2 },
    { name: 'Wed', alerts: 5 },
    { name: 'Thu', alerts: 1 },
    { name: 'Fri', alerts: 8 },
    { name: 'Sat', alerts: 3 },
    { name: 'Sun', alerts: metrics.safety.emergenciesToday },
  ];

  const pieData = [
    { name: 'Real Emergency', value: 35 },
    { name: 'False Alarm', value: 60 },
    { name: 'Testing', value: 5 },
  ];
  const COLORS = ['#E53E3E', '#319795', '#D69E2E'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1A365D] mb-8">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Users</h3>
          <p className="text-4xl font-black text-[#1A365D]">{metrics.users.total}</p>
        </div>
        
        <div className="card p-6 border-l-4 border-l-[#E53E3E]">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Emergencies</h3>
          <p className="text-4xl font-black text-[#E53E3E]">{metrics.safety.activeEmergencies}</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Emergencies Today</h3>
          <p className="text-4xl font-black text-[#319795]">{metrics.safety.emergenciesToday}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#1A365D] mb-4">Infrastructure Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6 flex justify-between items-center">
          <span className="font-semibold text-gray-700">API Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${metrics.system.apiStatus === 'HEALTHY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {metrics.system.apiStatus}
          </span>
        </div>
        <div className="card p-6 flex justify-between items-center">
          <span className="font-semibold text-gray-700">Database Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${metrics.system.databaseStatus === 'HEALTHY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {metrics.system.databaseStatus}
          </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#1A365D] mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-md font-bold text-gray-700 mb-4">Emergency Alerts (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
                <YAxis stroke="#A0AEC0" fontSize={12} />
                <Tooltip cursor={{fill: '#f4f5f7'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Bar dataKey="alerts" fill="#E53E3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-md font-bold text-gray-700 mb-4">Resolution Types</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-xs font-semibold text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
