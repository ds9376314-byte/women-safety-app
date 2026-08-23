import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 overflow-y-auto w-full h-full bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <div className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <p>Version: 1.0.0</p>
          <p>Effective Date: [LEGAL REVIEW REQUIRED]</p>
          <p>Last Updated: October 2023</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-2">What you should know</h2>
          <ul className="list-disc pl-5 text-blue-800 space-y-2">
            <li>SHEVORA does not continuously track users by default.</li>
            <li>Location is used only for enabled safety functionality.</li>
            <li>Emergency live location is shared only during an authorized emergency session.</li>
            <li>Trusted Persons receive only the information required for the emergency feature.</li>
            <li>Unnecessary location history is not retained.</li>
            <li>Users can request or delete their eligible account data at any time.</li>
          </ul>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Data Minimization & Collection</h2>
            <p className="mb-4">We collect only what is strictly necessary to operate safety features. We do not collect your data "just in case." When you create an account, we store your basic profile information. We do not permanently track your location.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Location Data & Emergencies</h2>
            <p className="mb-4">Your location is only tracked when you explicitly activate an SOS Emergency or Journey Guardian session. During an SOS, a 10-second delay occurs before your live location is shared securely with your Primary Trusted Contact. Location sharing stops immediately when the emergency is resolved or cancelled.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Retention</h2>
            <p className="mb-4">Emergency session metadata, location points, and safety activity logs are automatically deleted after 30 days unless legally required otherwise. We do not retain raw GPS data permanently.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">4. No Data Brokering or Advertising</h2>
            <p className="mb-4">We do not sell your personal data to data brokers. We do not use your safety data or location history for advertising, behavioral targeting, or unrelated profiling.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. User Rights (Export & Deletion)</h2>
            <p className="mb-4">You have the right to request a full export of your personal data or delete your account entirely from the app settings. Deletion requests permanently remove your profile, safety history, and trusted circle associations (except active emergencies which must be resolved first).</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Third-Party Services</h2>
            <p className="mb-4">We use the following necessary services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Twilio (for sending SMS alerts to non-SHEVORA users)</li>
              <li>MongoDB (for secure data storage)</li>
              <li>Firebase Cloud Messaging / Expo Push (for push notifications)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
