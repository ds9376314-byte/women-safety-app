"use client";
import { useEffect, useState } from "react";

export default function SupportPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [activeTicket, setActiveTicket] = useState<string | null>(null);

  const fetchRequests = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/admin/support/requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setRequests(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch support requests", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResolve = async (id: string) => {
    if (!resolutionText) return alert("Please enter a resolution note.");
    
    setActionLoading(id);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/support/requests/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: 'RESOLVED', resolution: resolutionText })
      });
      
      if (res.ok) {
        alert("Ticket Resolved!");
        setResolutionText("");
        setActiveTicket(null);
        fetchRequests();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to resolve ticket.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-gray-500 font-medium">Loading help desk...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1A365D] mb-8">Help Desk & Ticketing</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => (
          <div key={req._id} className={`card p-6 border-l-4 ${req.status === 'OPEN' ? 'border-l-orange-500' : 'border-l-green-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{req.subject}</h3>
                <p className="text-sm text-gray-500">From: {req.user?.name || 'Unknown'} • {new Date(req.createdAt).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'OPEN' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                {req.status}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-gray-700">
              {req.description}
            </div>
            
            {req.status === 'OPEN' && (
              <div>
                {activeTicket === req._id ? (
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Resolution Note</label>
                    <textarea 
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 mb-4 text-sm focus:outline-none focus:border-blue-500"
                      rows={3}
                      placeholder="Explain how this issue was resolved..."
                    ></textarea>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleResolve(req._id)}
                        disabled={actionLoading === req._id}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 text-sm"
                      >
                        {actionLoading === req._id ? 'Saving...' : 'Mark as Resolved'}
                      </button>
                      <button 
                        onClick={() => {setActiveTicket(null); setResolutionText("");}}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveTicket(req._id)}
                    className="px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded hover:bg-orange-200 text-sm transition-colors"
                  >
                    Reply / Resolve Ticket
                  </button>
                )}
              </div>
            )}
            
            {req.status === 'RESOLVED' && req.resolution && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <h4 className="text-xs font-bold text-green-800 uppercase mb-1">Resolution Provided</h4>
                <p className="text-sm text-green-900">{req.resolution}</p>
              </div>
            )}
          </div>
        ))}
        
        {requests.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <span className="text-gray-500 block text-lg mb-2">No Support Tickets</span>
            <p className="text-sm text-gray-400">All user requests have been handled.</p>
          </div>
        )}
      </div>
    </div>
  );
}
