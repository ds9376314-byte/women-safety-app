"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
    } else {
      setRole(localStorage.getItem("adminRole") || "");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    router.push("/");
  };

  const navItems = [
    { label: "Overview", path: "/dashboard", roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ANALYST"] },
    { label: "Emergencies (EOC)", path: "/dashboard/emergencies", roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"] },
    { label: "Help Requests", path: "/dashboard/support", roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"] },
    { label: "System Health", path: "/dashboard/system", roles: ["SUPER_ADMIN", "ADMIN"] },
    { label: "Users", path: "/dashboard/users", roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"] },
    { label: "Broadcasts", path: "/dashboard/broadcast", roles: ["SUPER_ADMIN", "ADMIN"] },
    { label: "Audit Logs", path: "/dashboard/audit", roles: ["SUPER_ADMIN"] },
  ];

  return (
    <div className="flex w-full h-full bg-[#F8F9FA]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A365D] text-white flex flex-col shadow-xl z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-widest text-center">SHEVORA</h2>
          <p className="text-xs text-center text-blue-300 uppercase mt-1 tracking-widest">Admin</p>
        </div>

        <nav className="flex-1 mt-6">
          <ul className="flex flex-col gap-2 px-4">
            {navItems
              .filter((item) => item.roles.includes(role))
              .map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block p-3 rounded-lg font-medium transition-colors ${
                      pathname === item.path
                        ? "bg-[#319795] text-white"
                        : "text-blue-100 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20">
          <p className="text-sm font-medium mb-4 px-2">Role: <span className="font-bold text-[#319795]">{role}</span></p>
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 text-red-300 hover:bg-white/10 rounded-lg font-medium transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
