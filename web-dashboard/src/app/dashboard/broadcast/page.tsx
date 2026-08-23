"use client";
import { useState } from "react";

export default function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    
    setSending(true);
    setSuccess(false);
    const token = localStorage.getItem("adminToken");
    
    try {
      const res = await fetch("http://localhost:5000/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message, severity })
      });
      
      if (res.ok) {
        setSuccess(true);
        setMessage("");
      } else {
        alert("Failed to send broadcast");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A365D]">Mass Broadcast System</h1>
        <p className="text-gray-500 mt-1">Send push notifications and alerts to all registered users.</p>
      </div>

      <div className="card p-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 font-medium">
            Broadcast sent successfully!
          </div>
        )}

        <form onSubmit={handleBroadcast}>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Alert Severity</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="severity" value="info" checked={severity === 'info'} onChange={() => setSeverity('info')} className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">Information</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="severity" value="warning" checked={severity === 'warning'} onChange={() => setSeverity('warning')} className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800 font-medium">Warning</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="severity" value="critical" checked={severity === 'critical'} onChange={() => setSeverity('critical')} className="w-4 h-4 text-red-600" />
                <span className="text-red-800 font-medium">Critical / SOS</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Broadcast Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g. Heavy rainfall predicted in Area X. Please stay safe."
              className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">This message will be sent as a push notification to all users' devices.</p>
          </div>

          <button 
            type="submit" 
            disabled={sending || !message}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all ${sending ? 'bg-gray-400' : 'bg-[#E53E3E] hover:bg-red-700'}`}
          >
            {sending ? 'Broadcasting...' : 'Send Mass Alert Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
