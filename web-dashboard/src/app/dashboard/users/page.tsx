"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (userId: string) => {
    if (!window.confirm("Are you sure you want to suspend this user? They will not be able to login.")) return;
    
    setActionLoading(userId);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: 'Admin Action' })
      });
      
      if (res.ok) {
        alert("User suspended successfully");
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to suspend user");
      }
    } catch (e) {
      console.error(e);
      alert("Error suspending user");
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Name,Email,Phone,Status,Joined Date"];
    const rows = users.map(u => `${u.name},${u.email},${u.phone || 'N/A'},${u.status || 'ACTIVE'},${new Date(u.createdAt).toISOString()}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-gray-500 font-medium">Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A365D]">User Management</h1>
        <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
          Download CSV
        </button>
      </div>
      
      <div className="card overflow-hidden border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Email</th>
              <th className="p-4 font-semibold text-gray-700">Phone</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Joined</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4 text-gray-600">{u.phone || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {u.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button 
                    disabled={u.status === 'SUSPENDED' || actionLoading === u._id}
                    onClick={() => handleSuspend(u._id)}
                    className={`px-3 py-1 text-xs font-bold rounded ${u.status === 'SUSPENDED' ? 'bg-gray-200 text-gray-400' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
                  >
                    {actionLoading === u._id ? 'Processing...' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
