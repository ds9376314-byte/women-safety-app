'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Clock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import axios from 'axios';

export default function PublicJourneyTracking({ params }: { params: { token: string } }) {
  const [journey, setJourney] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchJourney = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/journey/link/${params.token}`);
      setJourney(res.data);
    } catch (e) {
      console.log('Error fetching public journey');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
    const int = setInterval(fetchJourney, 15000); // poll every 15s
    return () => clearInterval(int);
  }, [params.token]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (journey && journey.mode === 'TIME_BASED' && journey.status === 'active') {
      const end = new Date(journey.expectedArrivalTime).getTime();
      interval = setInterval(() => {
        const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
        setTimeLeft(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [journey]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!journey) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Link Invalid or Expired</h1>
        <p className="text-gray-400">This tracking link is no longer valid.</p>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCompleted = journey.status === 'completed';
  const isActive = journey.status === 'active';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center mb-8 gap-3">
          <Shield className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold tracking-widest text-blue-500 uppercase">SHEVORA</h1>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl text-center">
          <h2 className="text-xl font-bold mb-1">{journey.user?.name}'s Journey</h2>
          
          {isCompleted ? (
            <div className="my-10 flex flex-col items-center">
              <CheckCircle size={64} className="text-green-500 mb-4" />
              <p className="text-xl text-green-400 font-bold">Safely Completed</p>
              <p className="text-gray-400 mt-2">The user has ended their journey safely.</p>
            </div>
          ) : isActive ? (
            <div className="my-10 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center animate-pulse mb-6">
                {journey.mode === 'TIME_BASED' ? (
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-500 tabular-nums">{formatTime(timeLeft)}</p>
                    <p className="text-sm text-gray-400 mt-1">Remaining</p>
                  </div>
                ) : (
                  <MapPin size={48} className="text-blue-500" />
                )}
              </div>
              <p className="text-xl text-blue-400 font-bold">Tracking Active</p>
              
              {journey.isSOSActivated && (
                 <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
                   <p className="text-red-400 font-bold">⚠️ AUTO-SOS TRIGGERED</p>
                   <p className="text-sm text-red-300 mt-1">The user failed to check-in on time. An emergency session has been escalated.</p>
                 </div>
              )}
            </div>
          ) : (
            <div className="my-10">
              <p className="text-xl text-gray-400">Journey is {journey.status}</p>
            </div>
          )}

          <div className="text-left bg-gray-900 rounded-xl p-4 mt-6">
            <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Journey Details</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Mode</span>
              <span className="font-medium">{journey.mode === 'TIME_BASED' ? 'Time-Based' : 'One-Tap Tracking'}</span>
            </div>
            {journey.mode === 'TIME_BASED' && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Expected Arrival</span>
                <span className="font-medium">{new Date(journey.expectedArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Started At</span>
              <span className="font-medium">{new Date(journey.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
