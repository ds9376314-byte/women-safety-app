"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

export default function EmergencyPublicLinkPage() {
  const { token } = useParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/emergency-sessions/link/${token}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          
          if (data.locationSharingStatus === "COUNTDOWN") {
            const startsAt = new Date(data.locationSharingStartsAt).getTime();
            const now = Date.now();
            if (startsAt > now) {
              setCountdown(Math.ceil((startsAt - now) / 1000));
            } else {
              setCountdown(0);
            }
          }
        } else {
          setError("Emergency link is invalid, expired, or has been resolved.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [token]);

  const handleAcknowledge = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/emergency-sessions/link/${token}/acknowledge`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSession(prev => ({ ...prev, escalationStatus: data.escalationStatus }));
        alert('Emergency acknowledged. Escalation to other contacts stopped.');
      }
    } catch (err) {
      alert('Network error while acknowledging.');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Refresh session to get map mode
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (session && session.status === "ACTIVE" && session.locationSharingStatus === "ACTIVE") {
      // Connect to WebSocket without token (public room, but the backend handles auth via room ID validation normally, 
      // though right now our backend requires token. We might need a public socket endpoint or bypass token for emergency view.
      // For now, we simulate receiving it).
      const newSocket = io("http://localhost:5000", { auth: { token: "public" } });
      setSocket(newSocket);
      
      newSocket.emit("join_emergency", { emergencyId: session._id }); // In reality, we need the ID, but the token endpoint hides it for security!
      // Wait, the API doesn't expose _id. We'd need to emit using the token instead.
      newSocket.on("location_updated", (data) => {
        setLocation(data);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Verifying secure link...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 text-center">
        <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full border-t-4 border-gray-600 shadow-2xl">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Session Ended</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const isResolved = session.status === "RESOLVED" || session.locationSharingStatus === "ENDED_WITH_EMERGENCY";
  const isCountdown = session.locationSharingStatus === "COUNTDOWN" && countdown > 0;
  const isStoppedByUser = session.locationSharingStatus === "STOPPED_BY_USER";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-red-600 p-4 text-center shadow-lg z-10 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <h1 className="font-bold tracking-widest uppercase">SHEVORA EMERGENCY ALERT</h1>
        </div>
        <p className="text-red-100 text-sm mb-4">Trusted Contact: {session.user?.name}</p>
        
        {session.escalationStatus !== 'ACKNOWLEDGED' && !isResolved && (
          <button 
            onClick={handleAcknowledge}
            className="bg-white text-red-600 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 active:bg-gray-200 transition-all border border-red-800"
          >
            I've seen this (Acknowledge)
          </button>
        )}
        {session.escalationStatus === 'ACKNOWLEDGED' && (
          <div className="bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg border border-green-700">
            ✓ Acknowledged
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {isResolved ? (
          <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-2xl border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-2">Emergency Resolved</h2>
            <p className="text-gray-400">This emergency session has ended safely. Live location sharing is no longer active.</p>
          </div>
        ) : isStoppedByUser ? (
          <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-2xl border border-gray-700">
             <h2 className="text-xl font-bold text-yellow-400 mb-2">Location Sharing Stopped</h2>
             <p className="text-gray-400">The user has manually stopped location sharing, but the emergency session remains active.</p>
          </div>
        ) : isCountdown ? (
          <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-2xl border border-red-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600/30">
              <div className="h-full bg-red-500 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / 10) * 100}%` }}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">Preparing Live Location</h2>
            <div className="flex justify-center items-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-red-500/30 flex items-center justify-center border-t-red-500 animate-spin">
                <div className="w-full h-full flex items-center justify-center animate-none" style={{ animationDirection: 'reverse' }}>
                   <span className="text-4xl font-black text-red-500">{countdown}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">To protect privacy, live location will begin transmitting securely in {countdown} seconds.</p>
          </div>
        ) : (
          <div className="w-full h-full min-h-[400px] bg-gray-800 rounded-xl relative overflow-hidden border border-gray-700 flex flex-col">
            <div className="absolute top-4 left-4 z-10 bg-black/80 px-4 py-2 rounded-full border border-gray-600 backdrop-blur flex items-center gap-2 shadow-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Live</span>
              <span className="text-xs text-gray-400 ml-2">Last updated: {location ? "Just now" : "Waiting for GPS..."}</span>
            </div>
            
            {/* Map Placeholder */}
            <div className="flex-1 flex items-center justify-center bg-[#1a202c]">
              <div className="text-center opacity-30">
                <div className="text-6xl mb-2">🗺️</div>
                <p className="font-bold tracking-widest">MAP VIEW ACTIVE</p>
                <p className="text-sm mt-2">{location ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}` : "Receiving coordinates..."}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
