import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 overflow-y-auto w-full h-full bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <div className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <p>Version: 1.0.0</p>
          <p>Effective Date: [LEGAL REVIEW REQUIRED]</p>
          <p>Last Updated: October 2023</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">By creating an account or using SHEVORA, you agree to these Terms of Service. If you do not agree, do not use the application.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Acceptable Use & SOS Misuse</h2>
            <p className="mb-4">SHEVORA is designed for personal safety. You agree not to misuse the SOS functionality, send false emergency alerts, harass others, or use the service for any illegal activities. Accounts found abusing the SOS system may be suspended or permanently terminated.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Trusted Circle</h2>
            <p className="mb-4">You are responsible for obtaining consent from individuals before adding them to your Trusted Circle. You must ensure the contact information provided is accurate.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
            <p className="mb-4">SHEVORA is a safety-support application, not a guaranteed emergency response service. We are not liable for network failures, GPS inaccuracies, delayed notifications, or the actions of third parties (including your Trusted Contacts).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Governing Law</h2>
            <p className="mb-4">[LEGAL REVIEW REQUIRED] These terms shall be governed by the applicable laws of your jurisdiction.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
