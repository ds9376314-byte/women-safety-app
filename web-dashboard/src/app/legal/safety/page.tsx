import React from 'react';

export default function SafetyDisclaimerPage() {
  return (
    <div className="flex-1 overflow-y-auto w-full h-full bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Safety Disclaimer</h1>
        <div className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <p>Version: 1.0.0</p>
          <p>Effective Date: [LEGAL REVIEW REQUIRED]</p>
          <p>Last Updated: October 2023</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-red-900 mb-2">CRITICAL NOTICE</h2>
          <p className="text-red-800 font-medium">SHEVORA is a safety-support application. It is NOT a guaranteed emergency response service and is NOT a replacement for local emergency services (like 911 or 112).</p>
        </div>

        <div className="space-y-6">
          <p>Please be aware of the following limitations when using the application:</p>
          
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Not a Guarantee of Safety:</strong> The application provides tools to help you connect with your trusted contacts, but it cannot guarantee your personal safety.</li>
            <li><strong>Technology Limitations:</strong> GPS tracking can fail due to weather, indoor environments, or device limitations. The app requires an active internet connection to send alerts.</li>
            <li><strong>Battery and Permissions:</strong> If your phone battery runs out, or if you deny necessary permissions (like Location or Notifications) to the app, the safety features will not function.</li>
            <li><strong>Delivery Delays:</strong> Network congestion or third-party service outages can cause notifications or SMS alerts to be delayed.</li>
            <li><strong>No Official Partnerships:</strong> Unless explicitly stated in your jurisdiction, SHEVORA does not have direct integrations with local police or emergency dispatch services.</li>
          </ul>

          <p className="mt-8 font-bold">In a true life-threatening emergency, always attempt to contact your local authorities directly if you are able to do so.</p>
        </div>
      </div>
    </div>
  );
}
